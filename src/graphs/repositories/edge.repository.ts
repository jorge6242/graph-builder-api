import { EntityRepository, Repository } from 'typeorm';
import { Edge } from '../entities/edge.entity';

@EntityRepository(Edge)
export class EdgeRepository extends Repository<Edge> {
}
