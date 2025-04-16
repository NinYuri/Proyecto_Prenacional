import { Module } from '@nestjs/common';
import { ClasificacionService } from './clasificacion.service';
import { ClasificacionController } from './clasificacion.controller';

@Module({
  controllers: [ClasificacionController],
  providers: [ClasificacionService],
})
export class ClasificacionModule {}
