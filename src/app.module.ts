import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env.validation';
import { GraphsModule } from './graphs/graphs.module';
import { HealthController } from './health/health.controller';

/**
 * Módulo raíz de la aplicación
 * Configura los módulos principales: ConfigModule y TypeORM
 * 
 * @module AppModule
 */
@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),

    // TypeORM config externalized
    TypeOrmModule.forRootAsync(typeOrmConfig),

    GraphsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
