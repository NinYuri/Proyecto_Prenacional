import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateRoldejuegoDto {
            @IsNumber()
            @Type(() => Number)
            public disciplinaid: number;
            @IsNumber()
            @Type(() => Number)
            public equipo1id: number;
            @IsNumber()
            @Type(() => Number)
            public equipo2id: number;
            @IsDate()
            @Type(() => Date)
            public fecha: Date;
            @IsNumber()
            @Type(() => Number)
            public puntuacionEquipo1: number;
            @IsNumber()
            @Type(() => Number)
            public puntuacionEquipo2: number;
            @IsString()
            public estado: string;
            @IsNumber()
            @Type(() => Number)
            public clasificadoid: number;
            @IsNumber()
            @Type(() => Number)
            public faseTorneoid: number;
}
