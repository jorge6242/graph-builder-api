import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para un nodo (topic) en el grafo
 * 
 * @class NodeDto
 */
export class NodeDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'Digital PR' })
  label: string;
}
