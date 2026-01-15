import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GraphsService } from './graphs.service';
import { CreateGraphDto } from './dto/create-graph.dto';
import { AddTopicsDto } from './dto/add-topics.dto';
import { GraphResponseDto } from './dto/graph-response.dto';
import { GraphDetailDto } from './dto/graph-detail.dto';
import { RelatedTopicsDto } from './dto/related-topic.dto';
import { ApiStandardErrors } from '../common/decorators/api-standard-responses.decorator';

/**
 * Controlador de Graphs
 * Maneja las peticiones HTTP relacionadas con Knowledge Graphs
 * 
 * @class GraphsController
 */
@ApiTags('graphs')
@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphsService: GraphsService) {}

  /**
   * Crea un nuevo grafo con topics y relaciones
   * 
   * @param dto - Datos del grafo
   * @returns Stats de creación
   */
  @Post()
  @ApiOperation({ summary: 'Create a new knowledge graph' })
  @ApiCreatedResponse({ type: GraphResponseDto })
  @ApiStandardErrors()
  async createGraph(@Body() dto: CreateGraphDto): Promise<GraphResponseDto> {
    return this.graphsService.createGraph(dto);
  }

  /**
   * Obtiene el detalle completo de un grafo
   * 
   * @param graphId - ID del grafo
   * @returns Grafo con nodes y edges
   */
  @Get(':graphId')
  @ApiOperation({ summary: 'Get graph by ID' })
  @ApiParam({ name: 'graphId', description: 'Graph UUID' })
  @ApiOkResponse({ type: GraphDetailDto })
  @ApiStandardErrors()
  async getGraph(@Param('graphId') graphId: string): Promise<GraphDetailDto> {
    return this.graphsService.getGraphById(graphId);
  }

  /**
   * Añade topics a un grafo existente
   * 
   * @param graphId - ID del grafo
   * @param dto - Nuevos topics
   * @returns Stats de operación
   */
  @Post(':graphId/topics')
  @ApiOperation({ summary: 'Add topics to existing graph' })
  @ApiParam({ name: 'graphId', description: 'Graph UUID' })
  @ApiCreatedResponse({ type: GraphResponseDto })
  @ApiStandardErrors()
  async addTopics(
    @Param('graphId') graphId: string,
    @Body() dto: AddTopicsDto,
  ): Promise<GraphResponseDto> {
    return this.graphsService.addTopicsToGraph(graphId, dto);
  }

  /**
   * Obtiene topics relacionados ordenados por score
   * 
   * @param graphId - ID del grafo
   * @param topicId - ID del topic
   * @param limit - Límite de resultados (default 10, max 50)
   * @returns Topic con relacionados
   */
  @Get(':graphId/topics/:topicId/related')
  @ApiOperation({ summary: 'Get related topics by score' })
  @ApiParam({ name: 'graphId', description: 'Graph UUID' })
  @ApiParam({ name: 'topicId', description: 'Topic UUID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ type: RelatedTopicsDto })
  @ApiStandardErrors()
  async getRelatedTopics(
    @Param('graphId') graphId: string,
    @Param('topicId') topicId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<RelatedTopicsDto> {
    return this.graphsService.getRelatedTopics(graphId, topicId, limit);
  }
}
