import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
     // @IsNumber()
    // @IsPositive()
    // @Type(() => Number)
    id_user: number;
}
