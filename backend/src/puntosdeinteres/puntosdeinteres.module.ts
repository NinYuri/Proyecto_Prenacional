import { Module } from '@nestjs/common';
import { PuntosdeinteresService } from './puntosdeinteres.service';
import { PuntosdeinteresController } from './puntosdeinteres.controller';

@Module({
  controllers: [PuntosdeinteresController],
  providers: [PuntosdeinteresService],
})
export class PuntosdeinteresModule {}
