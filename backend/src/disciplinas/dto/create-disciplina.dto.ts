import { IsNumber, IsString } from "class-validator";

export class CreateDisciplinaDto {

            @IsString()
            public nombre: string;
            @IsString()
            public categoria: string;           
}
