import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreatePartidoDto {

    @IsDate()
    @Type(() => Date)
    public fecha: Date;
    @IsString()
    public hora: string;
    @IsNumber()
    @Type(() => Number)
    public equipoLocalid: number;
    @IsNumber()
    @Type(() => Number)   
    public equipoVisitanteid: number;
    @IsNumber()
    @Type(() => Number)
    public canchaid: number;
    @IsNumber()
    @Type(() => Number)
    public faseTorneoid: number;
    @IsString()
    public estado: string;
    @IsNumber()
    @Type(() => Number)
    public puntosLocal: number;
    @IsNumber()
    @Type(() => Number)
    public puntosVisitante: number;

}
