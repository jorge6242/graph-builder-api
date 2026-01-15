import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

/**
 * Custom decorator que agrupa respuestas estándar de error
 * Evita repetir los mismos decoradores en cada endpoint
 * 
 * @returns Decoradores combinados
 */
export function ApiStandardErrors() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  );
}
