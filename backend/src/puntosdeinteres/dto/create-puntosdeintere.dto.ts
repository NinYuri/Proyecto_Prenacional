import { Decimal } from "@prisma/client/runtime/library";
import { Type } from "class-transformer";
import { IsDecimal, IsNumber, IsString } from "class-validator";

export class CreatePuntosdeintereDto {
        @IsString()
        public nombre: string;
        @IsString()
        public tipo: string;
        @IsString()
        public ubicacion: string;
        @IsString()
        public telefono: string;
        @IsString()
        public imagen: string;
        @IsString()
        public horarioAtencion: string;
        @IsNumber()
        @Type(() => Number)
        public calificacion: number;
    
}
