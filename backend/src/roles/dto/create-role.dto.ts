import { IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    public nombre: string;
    
}
