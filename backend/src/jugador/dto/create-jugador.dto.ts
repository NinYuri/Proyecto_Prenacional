import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateJugadorDto {
        @IsString()
        public nombre: string;
        @IsNumber()
        @Type(() => Number)
        public numero: number;
        @IsString()
        public posicion: string;
        @IsString()
        public foto: string;
        @IsNumber()
        @Type(() => Number)
        public equipoid: number;
}
