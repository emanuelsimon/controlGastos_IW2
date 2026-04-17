import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule);
 
  // Habilitá CORS
  app.enableCors({
    origin: 'http://127.0.0.1:5500', //frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
