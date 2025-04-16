import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto{

    @IsPositive()
    @IsOptional()
    @Type(()=> Number)
    page? : number = 1; //cuando page no traiga info por defecto lo pone en  1


    @IsPositive()
    @IsOptional()
    @Type(()=> Number)
    limit? : number = 10;  //cuando limit no traiga info por defecto lo pone en 10

}