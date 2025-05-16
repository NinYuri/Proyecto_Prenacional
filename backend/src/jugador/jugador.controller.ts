import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinary } from '../common/cloudinary';

@Controller('jugador')
export class JugadorController {
  constructor(private readonly jugadorService: JugadorService) {}

  @Post()
  create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadorService.create(createJugadorDto);
  }

  @Get()
  findAll() {
    return this.jugadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jugadorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJugadorDto: UpdateJugadorDto) {
    return this.jugadorService.update(+id, updateJugadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jugadorService.remove(+id);
  }

  @Post('foto')
  @UseInterceptors(FileInterceptor('foto'))
  async uploadFoto(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Debe seleccionar una imagen');
    }

    try {
      const result = await this.jugadorService.uploadImage(file);
      return { 
        success: true, 
        url: result.url 
      };
    } catch (error) {
      console.error('Error detallado:', error);
      throw new InternalServerErrorException('Error al subir la imagen');
    }
  }

  @Get('foto')
  async getFotos() {
    return this.jugadorService.getFotos();
  }
}