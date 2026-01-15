import { Injectable } from '@nestjs/common';
import { KeywordJaccardStrategy } from '../strategies/keyword-jaccard.strategy';
import { EdgeCandidate } from '../strategies/relationship-strategy.interface';

/**
 * Servicio para generar relaciones entre topics
 * Responsabilidad: orquestar estrategias de similitud
 * 
 * @class RelationshipService
 */
@Injectable()
export class RelationshipService {
  constructor(private readonly keywordJaccardStrategy: KeywordJaccardStrategy) {}

  /**
   * Genera edges entre topics usando la estrategia especificada
   * 
   * Proceso:
   * - Valida que hay al menos 2 topics
   * - Aplica estrategia seleccionada
   * - Normaliza edges (source < target alfabéticamente)
   * 
   * @param topics - Array de topics normalizados únicos
   * @param strategy - Nombre de la estrategia ('keyword_jaccard')
   * @param threshold - Umbral mínimo de similitud
   * @returns Array de edge candidates
   */
  generateEdges(
    topics: string[],
    strategy: string,
    threshold: number,
  ): EdgeCandidate[] {
    if (topics.length < 2) {
      return [];
    }

    const candidates = this.keywordJaccardStrategy.generate(topics, threshold);

    return candidates.map((edge) => this.normalizeEdge(edge));
  }

  /**
   * Normaliza un edge para que source sea alfabéticamente menor que target
   * 
   * @param edge - Edge candidato
   * @returns Edge normalizado
   */
  private normalizeEdge(edge: EdgeCandidate): EdgeCandidate {
    if (edge.topic1 <= edge.topic2) {
      return edge;
    }

    return {
      topic1: edge.topic2,
      topic2: edge.topic1,
      score: edge.score,
    };
  }
}
