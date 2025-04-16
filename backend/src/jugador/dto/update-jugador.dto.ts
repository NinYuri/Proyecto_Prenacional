import { PartialType } from '@nestjs/mapped-types';
import { CreateJugadorDto } from './create-jugador.dto';

export class UpdateJugadorDto extends PartialType(CreateJugadorDto) {
     // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_jugador: number;
}
