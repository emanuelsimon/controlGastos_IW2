import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule);
  
  // Aumentar límite de payload para imágenes en base64
  app.use(json({ limit: '10mb' }));
  
  // Agregar Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Agregar ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remover propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
      transform: true, // Transformar payload a instancia del DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
 
  // Habilitá CORS
  app.enableCors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();