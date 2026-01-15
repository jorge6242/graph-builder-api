import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO response when creating or adding topics to a graph
 *
 * @class GraphResponseDto
 */
export class GraphResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  graphId: string;

  @ApiProperty({
    example: {
      topicsCreated: 5,
      edgesCreated: 6,
      strategy: 'keyword_jaccard',
      threshold: 0.2,
    },
  })
  stats: {
    topicsCreated: number;
    edgesCreated: number;
    strategy: string;
    threshold: number;
  };
}
