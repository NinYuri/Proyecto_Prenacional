import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.use(express.json());
  app.use(cors()); 
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
