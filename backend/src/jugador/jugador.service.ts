import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class JugadorService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Jugador");
  }
  create(createJugadorDto: CreateJugadorDto) {
    return this.jugadores.create({
      data: createJugadorDto 
    });
  }

  findAll() {
    return this.jugadores.findMany();
  }

  async findOne(id: number) {
     const jugador = await this.jugadores.findFirst({where:{id_jugador: id}});
        if(!jugador){
          throw new NotFoundException({
            message: `Jugador con id ${id} no se encontró`,
            status: HttpStatus.BAD_REQUEST
    
          }); //Template string
        }
        return jugador;
  }

  async  update(id: number, updateJugadorDto: UpdateJugadorDto) {
    const {id_jugador:__,...data} = updateJugadorDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.jugadores.update({
      where:{id_jugador: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.jugadores.delete({
      where: {id_jugador: id}
    });
  }

  async uploadImage(file: Express.Multer.File) {
  if (!file?.buffer) {
    throw new BadRequestException('Archivo no válido');
  }

  // Asegurar que Cloudinary está configurado
  if (!cloudinary.config().cloud_name) {
    throw new InternalServerErrorException('Configuración de Cloudinary faltante');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'jugadores' },
      (error, result) => {
        if (error) {
          console.error('Error de Cloudinary:', error);
          return reject(new Error('Error al subir a Cloudinary'));
        }
        if (!result) {
          return reject(new Error('Respuesta vacía de Cloudinary'));
        }
        resolve({ 
          url: result.secure_url, 
          public_id: result.public_id 
        });
      }
    );
    uploadStream.end(file.buffer);
  });
}

async getFotos() {
  try {
    const fotos = await this.jugadores.findMany({
      select: { foto: true } 
    });
    return fotos;
  } catch (error) {
    throw new InternalServerErrorException('Error al obtener fotos');
  }
}
}
