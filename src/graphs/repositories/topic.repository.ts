import { Repository } from 'typeorm';
import { Topic } from '../entities/topic.entity';

export class TopicRepository extends Repository<Topic> {
  async findByNormalizedLabel(graphId: string, normalizedLabel: string): Promise<Topic | null> {
    return this.findOne({ where: { graphId, normalizedLabel } });
  }
}
