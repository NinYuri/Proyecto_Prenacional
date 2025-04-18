import {IsString } from "class-validator";

export class CreateTecDto {
    @IsString()
    public nombre: string;
    @IsString()
    public logo: string;
    @IsString()
    public ciudad: string;           
}
