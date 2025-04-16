import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FaseTorneoService } from './fase_torneo.service';
import { CreateFaseTorneoDto } from './dto/create-fase_torneo.dto';
import { UpdateFaseTorneoDto } from './dto/update-fase_torneo.dto';
import { PaginationDto } from 'src/common';

@Controller('fase-torneo')
export class FaseTorneoController {
  constructor(private readonly faseTorneoService: FaseTorneoService) {}

  @Post()
  create(@Body() createFaseTorneoDto: CreateFaseTorneoDto) {
    return this.faseTorneoService.create(createFaseTorneoDto);
  }

  @Get()
  findAll() {
    return this.faseTorneoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faseTorneoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaseTorneoDto: UpdateFaseTorneoDto) {
    return this.faseTorneoService.update(+id, updateFaseTorneoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faseTorneoService.remove(+id);
  }
}
