import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClasificacionService } from './clasificacion.service';
import { CreateClasificacionDto } from './dto/create-clasificacion.dto';
import { UpdateClasificacionDto } from './dto/update-clasificacion.dto';

@Controller('clasificacion')
export class ClasificacionController {
  constructor(private readonly clasificacionService: ClasificacionService) {}

  @Post()
  create(@Body() createClasificacionDto: CreateClasificacionDto) {
    return this.clasificacionService.create(createClasificacionDto);
  }

  @Get()
  findAll() {
    return this.clasificacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clasificacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClasificacionDto: UpdateClasificacionDto) {
    return this.clasificacionService.update(+id, updateClasificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clasificacionService.remove(+id);
  }
}
