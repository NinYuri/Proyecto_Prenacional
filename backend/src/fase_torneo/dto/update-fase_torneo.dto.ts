import { PartialType } from '@nestjs/mapped-types';
import { CreateFaseTorneoDto } from './create-fase_torneo.dto';

export class UpdateFaseTorneoDto extends PartialType(CreateFaseTorneoDto) {
    // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_fase_torneo: number;
}
