import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateRoldejuegoDto {
            @IsNumber()
            @Type(() => Number)
            public disciplinaid: number;
            @IsNumber()
            @Type(() => Number)
            public equipoLocalid: number;            
            @IsNumber()
            @Type(() => Number)
            public equipoVisitid: number;
            @IsString()
            public fecha: string;
            @IsString()
            public hora: string;
}
