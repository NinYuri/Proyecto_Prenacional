import { IsString } from "class-validator";

export class CreateCanchaDto {
        @IsString()
        public nombre: string;
        @IsString()
        public ubicacion: string;
        @IsString()
        public imagen: string;
        @IsString()
        public mapa: string;
        @IsString()
        public telefono: string;
        @IsString()
        public tipo: string;
}
