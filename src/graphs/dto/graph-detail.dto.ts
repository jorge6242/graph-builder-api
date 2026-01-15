import { ApiProperty } from '@nestjs/swagger';
import { NodeDto } from './node.dto';
import { EdgeDto } from './edge.dto';

/**
 * DTO for the complete details of a graph
 *
 * @class GraphDetailDto
 */
export class GraphDetailDto {
  @ApiProperty({ example: 'uuid-here' })
  graphId: string;

  @ApiProperty({ type: [NodeDto] })
  nodes: NodeDto[];

  @ApiProperty({ type: [EdgeDto] })
  edges: EdgeDto[];
}
