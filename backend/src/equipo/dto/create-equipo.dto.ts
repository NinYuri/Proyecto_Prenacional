import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateEquipoDto {
    @IsString()
    public nombre: string;
    @IsString()
    public ciudad: string;
    @IsNumber()
    @Type(() => Number)
    public diciplinaid: number;
}
   