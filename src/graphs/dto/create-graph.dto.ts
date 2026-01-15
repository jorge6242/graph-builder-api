import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';

/**
 * DTO to create a new graph with topics
 *
 * @class CreateGraphDto
 */
export class CreateGraphDto {
  /**
   * Optional name for the graph
   */
  @ApiPropertyOptional({ example: 'PR Topics Graph', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * List of topics (minimum 2)
   */
  @ApiProperty({
    example: ['AI', 'Press Release', 'SEO', 'Digital PR'],
    minItems: 2,
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  topics: string[];

  /**
   * Strategy to calculate relationships
   */
  @ApiPropertyOptional({ example: 'keyword_jaccard', default: 'keyword_jaccard' })
  @IsOptional()
  @IsString()
  strategy?: string = 'keyword_jaccard';

  /**
   * Minimum threshold to create relationships (0-1)
   */
  @ApiPropertyOptional({ example: 0.1, default: 0.1, minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number = 0.1;
}
