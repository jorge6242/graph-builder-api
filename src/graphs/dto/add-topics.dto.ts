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
 * DTO to add topics to an existing graph
 *
 * @class AddTopicsDto
 */
export class AddTopicsDto {
  /**
   * List of new topics to add (minimum 1)
   */
  @ApiProperty({
    example: ['Media Outreach', 'Backlinks'],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
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
