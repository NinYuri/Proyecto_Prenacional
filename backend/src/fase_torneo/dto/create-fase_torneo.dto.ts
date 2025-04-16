import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateFaseTorneoDto {
    @IsString()
    public nombre: string;
    @IsString()
    public descripcion: string;
    @IsDate()
    @Type(() => Date)
    public fechaInicio: Date;
    @IsDate()
    @Type(() => Date)
    public fechaFin: Date;
}
