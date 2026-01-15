import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Graph } from './entities/graph.entity';
import { Topic } from './entities/topic.entity';
import { Edge } from './entities/edge.entity';
import { CreateGraphDto } from './dto/create-graph.dto';
import { AddTopicsDto } from './dto/add-topics.dto';
import { GraphResponseDto } from './dto/graph-response.dto';
import { GraphDetailDto } from './dto/graph-detail.dto';
import { NodeDto } from './dto/node.dto';
import { EdgeDto } from './dto/edge.dto';
import { RelatedTopicsDto, RelatedTopicItemDto } from './dto/related-topic.dto';
import { RelationshipService } from './services/relationship.service';
import {
  GraphNotFoundException,
  TopicNotFoundException,
  DuplicateTopicException,
} from './errors/domain.errors';

/**
 * Servicio principal de Graphs
 * Contiene la lógica de negocio para gestión de Knowledge Graphs
 * 
 * @class GraphsService
 */
@Injectable()
export class GraphsService {
  constructor(
    @InjectRepository(Graph)
    private readonly graphRepository: Repository<Graph>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Edge)
    private readonly edgeRepository: Repository<Edge>,
    private readonly relationshipService: RelationshipService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea un nuevo grafo con topics y edges
   * 
   * @param dto - Datos del grafo a crear
   * @returns Stats de creación
   */
  async createGraph(dto: CreateGraphDto): Promise<GraphResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // Crear grafo
      const graph = manager.create(Graph, { name: dto.name });
      await manager.save(graph);

      // Normalizar y deduplificar topics
      const uniqueTopics = this.deduplicateTopics(dto.topics);

      // Crear topics
      const topics = uniqueTopics.map((label) =>
        manager.create(Topic, {
          graphId: graph.id,
          label,
          normalizedLabel: this.normalize(label),
        }),
      );
      await manager.save(topics);

      // Generar edges
      const edgeCandidates = this.relationshipService.generateEdges(
        uniqueTopics.map((t) => this.normalize(t)),
        dto.strategy || 'keyword_jaccard',
        dto.threshold ?? 0.1,
      );

      // Mapear normalized labels a topic IDs
      const labelToTopic = new Map(
        topics.map((t) => [t.normalizedLabel, t]),
      );

      const edges = edgeCandidates
        .map((candidate) => {
          const sourceTopic = labelToTopic.get(candidate.topic1);
          const targetTopic = labelToTopic.get(candidate.topic2);

          if (!sourceTopic || !targetTopic) {
            return null;
          }

          // Asegurar que sourceTopicId < targetTopicId para cumplir con el CHECK constraint
          const [minId, maxId] = [sourceTopic.id, targetTopic.id].sort();

          return manager.create(Edge, {
            graphId: graph.id,
            sourceTopicId: minId,
            targetTopicId: maxId,
            score: candidate.score,
            strategy: dto.strategy || 'keyword_jaccard',
          });
        })
        .filter((edge) => edge !== null);

      if (edges.length > 0) {
        await manager.save(edges);
      }

      return {
        graphId: graph.id,
        stats: {
          topicsCreated: topics.length,
          edgesCreated: edges.length,
          strategy: dto.strategy || 'keyword_jaccard',
          threshold: dto.threshold ?? 0.1,
        },
      };
    });
  }

  /**
   * Añade topics a un grafo existente
   * 
   * @param graphId - ID del grafo
   * @param dto - Nuevos topics a añadir
   * @returns Stats de operación
   */
  async addTopicsToGraph(
    graphId: string,
    dto: AddTopicsDto,
  ): Promise<GraphResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // Verificar que el grafo existe
      const graph = await manager.findOne(Graph, { where: { id: graphId } });
      if (!graph) {
        throw new GraphNotFoundException(graphId);
      }

      // Obtener topics existentes
      const existingTopics = await manager.find(Topic, {
        where: { graphId },
      });
      const existingNormalized = new Set(
        existingTopics.map((t) => t.normalizedLabel),
      );

      // Filtrar topics nuevos
      const uniqueNew = this.deduplicateTopics(dto.topics);
      const newTopicsToCreate = uniqueNew.filter(
        (label) => !existingNormalized.has(this.normalize(label)),
      );

      if (newTopicsToCreate.length === 0) {
        return {
          graphId,
          stats: {
            topicsCreated: 0,
            edgesCreated: 0,
            strategy: dto.strategy || 'keyword_jaccard',
            threshold: dto.threshold ?? 0.1,
          },
        };
      }

      // Crear nuevos topics
      const newTopics = newTopicsToCreate.map((label) =>
        manager.create(Topic, {
          graphId,
          label,
          normalizedLabel: this.normalize(label),
        }),
      );
      await manager.save(newTopics);

      // Generar edges solo con los topics nuevos vs todos
      const allTopics = [...existingTopics, ...newTopics];
      const allNormalized = allTopics.map((t) => t.normalizedLabel);

      const edgeCandidates = this.relationshipService.generateEdges(
        allNormalized,
        dto.strategy || 'keyword_jaccard',
        dto.threshold ?? 0.1,
      );

      // Filtrar solo edges que involucran al menos un topic nuevo
      const newTopicNormalized = new Set(
        newTopics.map((t) => t.normalizedLabel),
      );
      const newEdgeCandidates = edgeCandidates.filter(
        (c) =>
          newTopicNormalized.has(c.topic1) || newTopicNormalized.has(c.topic2),
      );

      // Mapear a IDs
      const labelToTopic = new Map(
        allTopics.map((t) => [t.normalizedLabel, t]),
      );

      const edges = newEdgeCandidates
        .map((candidate) => {
          const sourceTopic = labelToTopic.get(candidate.topic1);
          const targetTopic = labelToTopic.get(candidate.topic2);

          if (!sourceTopic || !targetTopic) {
            return null;
          }

          // Asegurar que sourceTopicId < targetTopicId para cumplir con el CHECK constraint
          const [minId, maxId] = [sourceTopic.id, targetTopic.id].sort();

          return manager.create(Edge, {
            graphId,
            sourceTopicId: minId,
            targetTopicId: maxId,
            score: candidate.score,
            strategy: dto.strategy || 'keyword_jaccard',
          });
        })
        .filter((edge) => edge !== null);

      if (edges.length > 0) {
        await manager.save(edges);
      }

      return {
        graphId,
        stats: {
          topicsCreated: newTopics.length,
          edgesCreated: edges.length,
          strategy: dto.strategy || 'keyword_jaccard',
          threshold: dto.threshold ?? 0.1,
        },
      };
    });
  }

  /**
   * Obtiene el detalle completo de un grafo
   * 
   * @param graphId - ID del grafo
   * @returns Grafo con nodes y edges
   */
  async getGraphById(graphId: string): Promise<GraphDetailDto> {
    const graph = await this.graphRepository.findOne({
      where: { id: graphId },
    });

    if (!graph) {
      throw new GraphNotFoundException(graphId);
    }

    const topics = await this.topicRepository.find({
      where: { graphId },
    });

    const edges = await this.edgeRepository.find({
      where: { graphId },
    });

    return {
      graphId: graph.id,
      nodes: topics.map((t) => ({
        id: t.id,
        label: t.label,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.sourceTopicId,
        target: e.targetTopicId,
        score: e.score,
        strategy: e.strategy,
      })),
    };
  }

  /**
   * Obtiene topics relacionados ordenados por score
   * 
   * @param graphId - ID del grafo
   * @param topicId - ID del topic
   * @param limit - Límite de resultados (default 10, max 50)
   * @returns Topic con sus relacionados
   */
  async getRelatedTopics(
    graphId: string,
    topicId: string,
    limit: number = 10,
  ): Promise<RelatedTopicsDto> {
    const topic = await this.topicRepository.findOne({
      where: { id: topicId, graphId },
    });

    if (!topic) {
      throw new TopicNotFoundException(topicId);
    }

    const maxLimit = Math.min(limit, 50);

    // Query edges donde el topic es source o target
    const edges = await this.edgeRepository
      .createQueryBuilder('edge')
      .where('edge.graphId = :graphId', { graphId })
      .andWhere(
        '(edge.sourceTopicId = :topicId OR edge.targetTopicId = :topicId)',
        { topicId },
      )
      .orderBy('edge.score', 'DESC')
      .limit(maxLimit)
      .getMany();

    // Obtener IDs de topics relacionados
    const relatedIds = edges.map((e) =>
      e.sourceTopicId === topicId ? e.targetTopicId : e.sourceTopicId,
    );

    const relatedTopics = await this.topicRepository.findByIds(relatedIds);

    // Mapear a DTO
    const topicMap = new Map(relatedTopics.map((t) => [t.id, t]));

    const related: RelatedTopicItemDto[] = edges
      .map((edge) => {
        const relatedId =
          edge.sourceTopicId === topicId
            ? edge.targetTopicId
            : edge.sourceTopicId;
        const relatedTopic = topicMap.get(relatedId);

        if (!relatedTopic) {
          return null;
        }

        return {
          topicId: relatedId,
          label: relatedTopic.label,
          score: edge.score,
        };
      })
      .filter((item) => item !== null);

    return {
      topic: {
        id: topic.id,
        label: topic.label,
      },
      related,
    };
  }

  /**
   * Normaliza un topic (lowercase + trim)
   */
  private normalize(topic: string): string {
    return topic.toLowerCase().trim();
  }

  /**
   * Deduplica topics por normalizedLabel
   */
  private deduplicateTopics(topics: string[]): string[] {
    const seen = new Map<string, string>();

    for (const topic of topics) {
      const normalized = this.normalize(topic);
      if (!seen.has(normalized)) {
        seen.set(normalized, topic);
      }
    }

    return Array.from(seen.values());
  }
}
