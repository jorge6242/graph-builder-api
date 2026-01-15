import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphsController } from './graphs.controller';
import { GraphsService } from './graphs.service';
import { Graph } from './entities/graph.entity';
import { Topic } from './entities/topic.entity';
import { Edge } from './entities/edge.entity';
import { GraphRepository } from './repositories/graph.repository';
import { TopicRepository } from './repositories/topic.repository';
import { EdgeRepository } from './repositories/edge.repository';
import { RelationshipService } from './services/relationship.service';
import { KeywordJaccardStrategy } from './strategies/keyword-jaccard.strategy';

/**
 * Módulo de Graphs
 * Encapsula toda la funcionalidad relacionada con Knowledge Graphs
 * 
 * @module GraphsModule
 * @description
 * Proporciona:
 * - Gestión de grafos, topics y edges
 * - Generación de relaciones entre topics
 * - APIs REST para consulta y manipulación
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Graph, Topic, Edge]),
  ],
  controllers: [GraphsController],
  providers: [
    GraphsService,
    RelationshipService,
    KeywordJaccardStrategy,
  ],
  exports: [GraphsService],
})
export class GraphsModule {}
