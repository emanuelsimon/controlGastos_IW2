import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule);
  
  // Aumentar límite de payload para imágenes en base64
  app.use(json({ limit: '10mb' }));
 
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