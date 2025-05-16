import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { JugadorController } from './jugador.controller';
import { JugadorService } from './jugador.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [JugadorController],
  providers: [JugadorService],
})
export class JugadorModule {}
