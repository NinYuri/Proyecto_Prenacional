import { Type } from "class-transformer";
import {IsNumber, IsString } from "class-validator";

export class CreatePartidoDto {
    @IsNumber()
    @Type(() => Number)
    public rolid: number;
    @IsNumber()
    @Type(() => Number)
    public canchaid: number;
    @IsNumber()
    @Type(() => Number)
    public puntosLocal: number;
    @IsNumber()
    @Type(() => Number)
    public puntosVisitante: number;
    @IsString()
    public fase: string;
    @IsString()
    public estado: string;
    @IsString()
    public papeleta: string;
}
