import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateGrupoDto {
        @IsString()
        public nombre: string;
        @IsNumber()
        @Type(() => Number)
        public disciplinaid: number;

    
}
