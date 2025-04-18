import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateEquipoDto {
    @IsString()
    public nombre: string;
    @IsNumber()
    @Type(() => Number)
    public diciplinaid: number;
    @IsNumber()
    @Type(() => Number)
    public grupoid: number;
    @IsNumber()
    @Type(() => Number)
    public tecsid: number;
}
   