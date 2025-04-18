import { Module } from '@nestjs/common';
import { TecsService } from './tecs.service';
import { TecsController } from './tecs.controller';

@Module({
  controllers: [TecsController],
  providers: [TecsService],
})
export class TecsModule {}
