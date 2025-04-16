import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuntosdeinteresService } from './puntosdeinteres.service';
import { CreatePuntosdeintereDto } from './dto/create-puntosdeintere.dto';
import { UpdatePuntosdeintereDto } from './dto/update-puntosdeintere.dto';

@Controller('puntosdeinteres')
export class PuntosdeinteresController {
  constructor(private readonly puntosdeinteresService: PuntosdeinteresService) {}

  @Post()
  create(@Body() createPuntosdeintereDto: CreatePuntosdeintereDto) {
    return this.puntosdeinteresService.create(createPuntosdeintereDto);
  }

  @Get()
  findAll() {
    return this.puntosdeinteresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntosdeinteresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuntosdeintereDto: UpdatePuntosdeintereDto) {
    return this.puntosdeinteresService.update(+id, updatePuntosdeintereDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puntosdeinteresService.remove(+id);
  }
}
