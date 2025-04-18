import { PartialType } from '@nestjs/mapped-types';
import { CreateTecDto } from './create-tec.dto';

export class UpdateTecDto extends PartialType(CreateTecDto) {
    // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_tecs: number;
}
