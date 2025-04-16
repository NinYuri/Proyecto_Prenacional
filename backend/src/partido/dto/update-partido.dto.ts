import { PartialType } from '@nestjs/mapped-types';
import { CreatePartidoDto } from './create-partido.dto';

export class UpdatePartidoDto extends PartialType(CreatePartidoDto) {
    // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_partido: number;
}
