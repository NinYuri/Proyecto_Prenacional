import { PartialType } from '@nestjs/mapped-types';
import { CreateRoldejuegoDto } from './create-roldejuego.dto';

export class UpdateRoldejuegoDto extends PartialType(CreateRoldejuegoDto) {

    id_RolDeJuegos: number;
    
}
