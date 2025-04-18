import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TecsService } from './tecs.service';
import { CreateTecDto } from './dto/create-tec.dto';
import { UpdateTecDto } from './dto/update-tec.dto';

@Controller('tecs')
export class TecsController {
  constructor(private readonly tecsService: TecsService) {}

  @Post()
  create(@Body() createTecDto: CreateTecDto) {
    return this.tecsService.create(createTecDto);
  }

  @Get()
  findAll() {
    return this.tecsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tecsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTecDto: UpdateTecDto) {
    return this.tecsService.update(+id, updateTecDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tecsService.remove(+id);
  }
}
