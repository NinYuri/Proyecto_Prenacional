import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateClasificacionDto {

      @IsNumber()
      @Type(() => Number)
      public equipoid: number;   // Llave foránea para equipo

      @IsNumber()
      @Type(() => Number)
      public puntosTotales: number;

      @IsNumber()
      @Type(() => Number)
      public partidosJugados: number;

      @IsNumber()
      @Type(() => Number)
      public partidosGanados: number;

      @IsNumber()
      @Type(() => Number)
      public partidosPerdidos: number;

      @IsNumber()
      @Type(() => Number)
      public puntosAFavor: number;

      @IsNumber()
      @Type(() => Number)
      public puntosEnContra: number;

      @IsNumber()
      @Type(() => Number)
      public puntosPorPartido: number;

      @IsNumber()
      @Type(() => Number)
      public diferenciaPuntos: number;
}
