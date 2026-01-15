import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

/**
 * Enum of allowed environments for NODE_ENV
 * Defines the valid values for the execution environment
 */
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Validation class for environment variables
 * Uses class-validator decorators to ensure correct types and ranges
 *
 * @class EnvironmentVariables
 * @description Validates all environment variables required by the application
 */
class EnvironmentVariables {
  /**
   * Application execution environment
   * @type {Environment}
   */
  @IsEnum(Environment)
  NODE_ENV: Environment;

  /**
   * Port on which the server will run
   * @type {number}
   * @default 8000
   */
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 8000;

  /**
   * PostgreSQL server host
   * @type {string}
   */
  @IsString()
  DB_HOST: string;

  /**
   * PostgreSQL server port
   * @type {number}
   * @default 5432
   */
  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT: number = 5432;

  /**
   * Database user
   * @type {string}
   */
  @IsString()
  DB_USER: string;

  /**
   * Database password
   * @type {string}
   */
  @IsString()
  DB_PASSWORD: string;

  /**
   * Database name
   * @type {string}
   */
  @IsString()
  DB_NAME: string;

  /**
   * Default strategy to generate relationships between topics
   * @type {string}
   * @default 'keyword_jaccard'
   */
  @IsString()
  RELATIONSHIP_STRATEGY_DEFAULT: string = 'keyword_jaccard';

  /**
   * Default threshold to accept a relationship
   * Range: 0.0 to 1.0
   * @type {number}
   * @default 0.2
   */
  @IsNumber()
  @Min(0)
  @Max(1)
  RELATIONSHIP_THRESHOLD_DEFAULT: number = 0.2;

  /**
   * Maximum number of topics allowed per graph
   * To avoid performance issues in O(n²) relationship generation
   * @type {number}
   * @default 200
   */
  @IsNumber()
  @Min(2)
  @Max(1000)
  MAX_TOPICS_PER_GRAPH: number = 200;
}

/**
 * Validation function for ConfigModule
 * Transforms and validates environment variables at application startup
 *
 * @function validate
 * @param {Record<string, unknown>} config - Unvalidated environment variables
 * @returns {EnvironmentVariables} Validated environment variables
 * @throws {Error} If any variable is invalid or missing
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   validate,
 *   isGlobal: true,
 * })
 * ```
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Config validation error:\n${errors.map((err) => Object.values(err.constraints || {}).join(', ')).join('\n')}`,
    );
  }

  return validatedConfig;
}
