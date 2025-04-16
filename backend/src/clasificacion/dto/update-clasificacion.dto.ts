import { PartialType } from '@nestjs/mapped-types';
import { CreateClasificacionDto } from './create-clasificacion.dto';

export class UpdateClasificacionDto extends PartialType(CreateClasificacionDto) {
     // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_clasificacion: number;
}
