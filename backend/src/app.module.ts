import { Module } from '@nestjs/common';

import { EquipoModule } from './equipo/equipo.module';
import { UserModule } from './user/user.module';
import { CanchaModule } from './cancha/cancha.module';
import { FaseTorneoModule } from './fase_torneo/fase_torneo.module';
import { ClasificacionModule } from './clasificacion/clasificacion.module';
import { JugadorModule } from './jugador/jugador.module';
import { PartidoModule } from './partido/partido.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { GruposModule } from './grupos/grupos.module';
import { PuntosdeinteresModule } from './puntosdeinteres/puntosdeinteres.module';
import { RoldejuegosModule } from './roldejuegos/roldejuegos.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ EquipoModule, UserModule, CanchaModule, FaseTorneoModule, ClasificacionModule, JugadorModule, PartidoModule, DisciplinasModule, GruposModule, PuntosdeinteresModule, RoldejuegosModule, RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
