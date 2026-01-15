/**
 * Representa un edge candidato con score de similitud
 */
export interface EdgeCandidate {
  topic1: string;
  topic2: string;
  score: number;
}

/**
 * Interface para estrategias de cálculo de relaciones entre topics
 * 
 * @interface RelationshipStrategy
 */
export interface RelationshipStrategy {
  /**
   * Genera edges entre topics según la estrategia
   * 
   * @param topics - Array de topics normalizados
   * @param threshold - Umbral mínimo de similitud (0-1)
   * @returns Array de edges candidatos
   */
  generate(topics: string[], threshold: number): EdgeCandidate[];
}
