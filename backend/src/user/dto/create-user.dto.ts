import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public nombre: string;
  @IsString()
  public contrasena: string;
}