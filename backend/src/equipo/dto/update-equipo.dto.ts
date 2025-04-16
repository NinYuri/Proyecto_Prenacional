import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './create-equipo.dto';
import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {
    // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_equipo: number;
}
