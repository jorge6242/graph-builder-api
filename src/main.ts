import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Función de inicialización de la aplicación NestJS
 * 
 * @async
 * @function bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar prefijo global
  app.setGlobalPrefix('v1');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Knowledge Graph Builder API')
    .setDescription('API para crear y gestionar grafos de conocimiento con topics relacionados')
    .setVersion('1.0')
    .addTag('graphs')
    .addTag('health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT') || 8000;

  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}/v1`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api`);
}

bootstrap();
