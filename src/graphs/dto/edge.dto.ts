import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for an edge (relationship) in the graph
 *
 * @class EdgeDto
 */
export class EdgeDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'uuid-source' })
  source: string;

  @ApiProperty({ example: 'uuid-target' })
  target: string;

  @ApiProperty({ example: 0.3333 })
  score: number;

  @ApiProperty({ example: 'keyword_jaccard' })
  strategy: string;
}
