import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    id_rol: number;
}
