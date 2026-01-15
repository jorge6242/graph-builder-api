import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

/**
 * Health check controller
 * 
 * @class HealthController
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Health check endpoint
   * 
   * @returns Status OK
   */
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Service is healthy' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
