import { PartialType } from '@nestjs/mapped-types';
import { CreatePuntosdeintereDto } from './create-puntosdeintere.dto';

export class UpdatePuntosdeintereDto extends PartialType(CreatePuntosdeintereDto) {

    id_PuntosdeInteres: number;
}
