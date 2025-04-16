import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplinaDto } from './create-disciplina.dto';

export class UpdateDisciplinaDto extends PartialType(CreateDisciplinaDto) {

    // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_diciplinas: number;
}
