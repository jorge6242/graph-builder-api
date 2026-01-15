import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Topic } from './topic.entity';
import { Edge } from './edge.entity';

/**
 * Entidad Graph (Grafo de conocimiento)
 * Representa un grafo que contiene múltiples topics relacionados entre sí
 * 
 * @entity graphs
 * @description
 * Tabla principal que agrupa topics y edges.
 * Un grafo puede contener hasta MAX_TOPICS_PER_GRAPH topics (definido en env).
 * 
 * @example
 * ```typescript
 * const graph = new Graph();
 * graph.name = 'PR Topics Graph';
 * await graphRepository.save(graph);
 * ```
 */
@Entity('graphs')
export class Graph {
  /**
   * Identificador único del grafo
   * @type {string}
   * @format uuid
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre descriptivo del grafo (opcional)
   * Ayuda a identificar el contexto o propósito del grafo
   * @type {string}
   * @maxLength 255
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  /**
   * Fecha y hora de creación del grafo
   * @type {Date}
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Relación uno a muchos con Topics
   * Un grafo puede tener múltiples topics
   * @type {Topic[]}
   */
  @OneToMany(() => Topic, (topic) => topic.graph)
  topics: Topic[];

  /**
   * Relación uno a muchos con Edges
   * Un grafo puede tener múltiples edges (relaciones entre topics)
   * @type {Edge[]}
   */
  @OneToMany(() => Edge, (edge) => edge.graph)
  edges: Edge[];
}
