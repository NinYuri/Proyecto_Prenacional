import { Module } from '@nestjs/common';

import { EquipoModule } from './equipo/equipo.module';
import { UserModule } from './user/user.module';
import { CanchaModule } from './cancha/cancha.module';
import { ClasificacionModule } from './clasificacion/clasificacion.module';
import { JugadorModule } from './jugador/jugador.module';
import { PartidoModule } from './partido/partido.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { GruposModule } from './grupos/grupos.module';
import { PuntosdeinteresModule } from './puntosdeinteres/puntosdeinteres.module';
import { RoldejuegosModule } from './roldejuegos/roldejuegos.module';
import { TecsModule } from './tecs/tecs.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ EquipoModule, UserModule, CanchaModule, ClasificacionModule, JugadorModule, PartidoModule, DisciplinasModule, GruposModule, PuntosdeinteresModule, RoldejuegosModule, TecsModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
