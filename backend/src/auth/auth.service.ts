import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async validateUser(nombre: string, contrasena: string) {
    const user = await this.prisma.usuarios.findUnique({ where: { nombre } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    if (user.contrasena !== contrasena) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: user.id_user, nombre: user.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id_user, nombre: user.nombre }
    };
  }
}
