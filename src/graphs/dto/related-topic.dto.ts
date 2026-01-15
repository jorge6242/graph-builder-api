import { ApiProperty } from '@nestjs/swagger';
import { NodeDto } from './node.dto';

/**
 * DTO para un topic relacionado con su score
 * 
 * @class RelatedTopicItemDto
 */
export class RelatedTopicItemDto {
  @ApiProperty({ example: 'uuid-here' })
  topicId: string;

  @ApiProperty({ example: 'Media Outreach' })
  label: string;

  @ApiProperty({ example: 0.75 })
  score: number;
}

/**
 * DTO de respuesta para topics relacionados
 * 
 * @class RelatedTopicsDto
 */
export class RelatedTopicsDto {
  @ApiProperty({ type: NodeDto })
  topic: NodeDto;

  @ApiProperty({ type: [RelatedTopicItemDto] })
  related: RelatedTopicItemDto[];
}
