import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { Graph } from './graph.entity';
import { Topic } from './topic.entity';

/**
 * Entidad Edge (Arista/Relación del grafo)
 * Representa una relación dirigida entre dos topics con un score de similitud
 * 
 * @entity edges
 * @description
 * Cada edge conecta dos topics (source y target) con un score calculado por una estrategia.
 * Los edges se almacenan normalizados: source_topic_id < target_topic_id para evitar duplicados.
 * 
 * Constraints:
 * - UNIQUE(graph_id, source_topic_id, target_topic_id): No se permiten edges duplicados
 * - CHECK(source_topic_id < target_topic_id): Garantiza normalización de pares
 * 
 * @example
 * ```typescript
 * const edge = new Edge();
 * edge.sourceTopicId = topic1.id < topic2.id ? topic1.id : topic2.id;
 * edge.targetTopicId = topic1.id < topic2.id ? topic2.id : topic1.id;
 * edge.score = 0.75;
 * edge.strategy = 'keyword_jaccard';
 * edge.graph = graph;
 * await edgeRepository.save(edge);
 * ```
 */
@Entity('edges')
@Unique('UQ_graph_source_target', ['graphId', 'sourceTopicId', 'targetTopicId'])
@Check('CHK_source_less_than_target', '"source_topic_id" < "target_topic_id"')
export class Edge {
  /**
   * Identificador único del edge
   * @type {string}
   * @format uuid
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID del grafo al que pertenece este edge
   * @type {string}
   * @format uuid
   */
  @Column({ name: 'graph_id' })
  graphId: string;

  /**
   * ID del topic origen (siempre menor que targetTopicId)
   * Esta normalización garantiza que no haya edges duplicados A->B y B->A
   * @type {string}
   * @format uuid
   */
  @Column({ name: 'source_topic_id' })
  sourceTopicId: string;

  /**
   * ID del topic destino (siempre mayor que sourceTopicId)
   * @type {string}
   * @format uuid
   */
  @Column({ name: 'target_topic_id' })
  targetTopicId: string;

  /**
   * Score de similitud entre los dos topics
   * Rango: 0.0000 a 1.0000
   * Valores más altos indican mayor similitud
   * @type {number}
   * @minimum 0
   * @maximum 1
   */
  @Column({ type: 'decimal', precision: 5, scale: 4 })
  score: number;

  /**
   * Nombre de la estrategia usada para calcular el score
   * Ejemplos: 'keyword_jaccard', 'embedding_cosine'
   * @type {string}
   * @maxLength 50
   */
  @Column({ length: 50 })
  strategy: string;

  /**
   * Fecha y hora de creación del edge
   * @type {Date}
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Relación muchos a uno con Graph
   * Múltiples edges pertenecen a un grafo
   * @type {Graph}
   */
  @ManyToOne(() => Graph, (graph) => graph.edges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'graph_id' })
  graph: Graph;

  /**
   * Relación muchos a uno con Topic (source)
   * @type {Topic}
   */
  @ManyToOne(() => Topic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_topic_id' })
  sourceTopic: Topic;

  /**
   * Relación muchos a uno con Topic (target)
   * @type {Topic}
   */
  @ManyToOne(() => Topic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_topic_id' })
  targetTopic: Topic;
}
