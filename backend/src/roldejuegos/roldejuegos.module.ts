import { Module } from '@nestjs/common';
import { RoldejuegosService } from './roldejuegos.service';
import { RoldejuegosController } from './roldejuegos.controller';

@Module({
  controllers: [RoldejuegosController],
  providers: [RoldejuegosService],
})
export class RoldejuegosModule {}
