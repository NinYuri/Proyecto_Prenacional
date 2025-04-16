import { Module } from '@nestjs/common';
import { FaseTorneoService } from './fase_torneo.service';
import { FaseTorneoController } from './fase_torneo.controller';

@Module({
  controllers: [FaseTorneoController],
  providers: [FaseTorneoService],
})
export class FaseTorneoModule {}
