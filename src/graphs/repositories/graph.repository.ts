import { EntityRepository, Repository } from 'typeorm';
import { Graph } from '../entities/graph.entity';

@EntityRepository(Graph)
export class GraphRepository extends Repository<Graph> {
  async findByName(name: string): Promise<Graph | null> {
    return this.findOne({ where: { name } });
  }
}
