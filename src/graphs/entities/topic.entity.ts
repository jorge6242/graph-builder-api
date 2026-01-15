import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Graph } from './graph.entity';

/**
 * Entidad Topic (Nodo del grafo)
 * Representa un tema o concepto dentro de un grafo de conocimiento
 * 
 * @entity topics
 * @description
 * Cada topic es un nodo en el grafo con una etiqueta original y una normalizada.
 * La etiqueta normalizada se usa para detectar duplicados y generar relaciones.
 * 
 * Constraints:
 * - UNIQUE(graph_id, normalized_label): No se permiten topics duplicados en un mismo grafo
 * 
 * @example
 * ```typescript
 * const topic = new Topic();
 * topic.label = 'Digital PR';
 * topic.normalizedLabel = 'digital pr';
 * topic.graph = graph;
 * await topicRepository.save(topic);
 * ```
 */
@Entity('topics')
@Unique('UQ_graph_normalized_label', ['graphId', 'normalizedLabel'])
export class Topic {
  /**
   * Identificador único del topic
   * @type {string}
   * @format uuid
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * ID del grafo al que pertenece este topic
   * @type {string}
   * @format uuid
   */
  @Column({ name: 'graph_id' })
  graphId: string;

  /**
   * Etiqueta original del topic tal como fue ingresada
   * Preserva mayúsculas, espacios y formato original
   * @type {string}
   * @maxLength 80
   */
  @Column({ length: 80 })
  label: string;

  /**
   * Etiqueta normalizada del topic
   * Versión procesada: lowercase, trimmed, sin puntuación
   * Se usa para detectar duplicados y generar relaciones
   * @type {string}
   * @maxLength 80
   */
  @Column({ name: 'normalized_label', length: 80 })
  normalizedLabel: string;

  /**
   * Fecha y hora de creación del topic
   * @type {Date}
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Relación muchos a uno con Graph
   * Múltiples topics pertenecen a un grafo
   * @type {Graph}
   */
  @ManyToOne(() => Graph, (graph) => graph.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'graph_id' })
  graph: Graph;
}
