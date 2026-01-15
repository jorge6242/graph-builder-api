import { Injectable } from '@nestjs/common';
import { RelationshipStrategy, EdgeCandidate } from './relationship-strategy.interface';

/**
 * Estrategia que calcula similitud entre topics usando coeficiente de Jaccard
 * sobre palabras clave extraídas de cada topic.
 * 
 * Algoritmo:
 * 1. Normaliza cada topic: lowercase, sin puntuación, tokeniza
 * 2. Calcula Jaccard para cada par: |A ∩ B| / |A ∪ B|
 * 3. Filtra por threshold
 * 
 * @class KeywordJaccardStrategy
 * @implements {RelationshipStrategy}
 */
@Injectable()
export class KeywordJaccardStrategy implements RelationshipStrategy {
  /**
   * Genera edges entre topics usando similitud Jaccard
   * 
   * @param topics - Array de topics normalizados
   * @param threshold - Umbral mínimo (0-1)
   * @returns Array de edges con score >= threshold
   */
  generate(topics: string[], threshold: number): EdgeCandidate[] {
    const edges: EdgeCandidate[] = [];
    const tokenizedTopics = topics.map((t) => this.tokenize(t));

    for (let i = 0; i < topics.length; i++) {
      for (let j = i + 1; j < topics.length; j++) {
        const score = this.calculateJaccard(
          tokenizedTopics[i],
          tokenizedTopics[j],
        );

        if (score >= threshold) {
          edges.push({
            topic1: topics[i],
            topic2: topics[j],
            score,
          });
        }
      }
    }

    return edges;
  }

  /**
   * Tokeniza un topic en palabras clave
   * 
   * Proceso:
   * - Convierte a lowercase
   * - Elimina puntuación
   * - Split por espacios
   * - Filtra palabras vacías
   * 
   * @param topic - Topic a tokenizar
   * @returns Set de tokens únicos
   */
  private tokenize(topic: string): Set<string> {
    const normalized = topic
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();

    const tokens = normalized
      .split(/\s+/)
      .filter((token) => token.length > 0);

    return new Set(tokens);
  }

  /**
   * Calcula coeficiente de Jaccard entre dos sets
   * 
   * Fórmula: J(A,B) = |A ∩ B| / |A ∪ B|
   * 
   * @param set1 - Primer set de tokens
   * @param set2 - Segundo set de tokens
   * @returns Score de similitud entre 0 y 1
   */
  private calculateJaccard(set1: Set<string>, set2: Set<string>): number {
    if (set1.size === 0 && set2.size === 0) {
      return 0;
    }

    const intersection = new Set(
      [...set1].filter((token) => set2.has(token)),
    );

    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }
}
