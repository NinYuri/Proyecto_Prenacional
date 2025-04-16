import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors()); // añadi esta linea para permitir el acceso a la API desde cualquier origen 
  app.setGlobalPrefix('api');
  app.useGlobalPipes(  
    new ValidationPipe({ 
  whitelist: true, 
  forbidNonWhitelisted: true, 
    }) 
  );
  await app.listen(3000);
}
bootstrap();
