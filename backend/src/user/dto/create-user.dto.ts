import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()  // Porque el nombre es nullable
  @IsString()
  public nombre: string;
  
  @IsNumber()
  @Type(() => Number)
  public rollid: number;
  @IsNumber()
  @Type(() => Number)
  public disciplinaid: number;
  @IsNumber()
  @Type(() => Number)
  public grupoid: number;

}

