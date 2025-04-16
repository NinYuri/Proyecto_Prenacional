import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoldejuegosService } from './roldejuegos.service';
import { CreateRoldejuegoDto } from './dto/create-roldejuego.dto';
import { UpdateRoldejuegoDto } from './dto/update-roldejuego.dto';

@Controller('roldejuegos')
export class RoldejuegosController {
  constructor(private readonly roldejuegosService: RoldejuegosService) {}

  @Post()
  create(@Body() createRoldejuegoDto: CreateRoldejuegoDto) {
    return this.roldejuegosService.create(createRoldejuegoDto);
  }

  @Get()
  findAll() {
    return this.roldejuegosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roldejuegosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoldejuegoDto: UpdateRoldejuegoDto) {
    return this.roldejuegosService.update(+id, updateRoldejuegoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roldejuegosService.remove(+id);
  }
}
