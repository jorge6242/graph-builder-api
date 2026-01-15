import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción cuando un grafo no existe
 * 
 * @class GraphNotFoundException
 */
export class GraphNotFoundException extends HttpException {
  constructor(graphId: string) {
    super(`Graph with ID ${graphId} not found`, HttpStatus.NOT_FOUND);
  }
}

/**
 * Excepción cuando un topic no existe
 * 
 * @class TopicNotFoundException
 */
export class TopicNotFoundException extends HttpException {
  constructor(topicId: string) {
    super(`Topic with ID ${topicId} not found`, HttpStatus.NOT_FOUND);
  }
}

/**
 * Excepción para inputs inválidos
 * 
 * @class InvalidInputException
 */
export class InvalidInputException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Excepción cuando se intenta duplicar un topic
 * 
 * @class DuplicateTopicException
 */
export class DuplicateTopicException extends HttpException {
  constructor(label: string) {
    super(`Topic "${label}" already exists in this graph`, HttpStatus.CONFLICT);
  }
}
