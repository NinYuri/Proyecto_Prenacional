import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateClasificacionDto } from './dto/create-clasificacion.dto';
import { UpdateClasificacionDto } from './dto/update-clasificacion.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ClasificacionService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Clasificacion");
  }
  create(createClasificacionDto: CreateClasificacionDto) {
    return this.clasificacion.create({
      data: createClasificacionDto 
    });
  }

async findAll() {
      return this.clasificacion.findMany();
  }

  async findOne(id: number) {
    const clasificacion = await this.clasificacion.findFirst({where:{id_clasificacion: id}});
    if(!clasificacion){
      throw new NotFoundException({
        message: `Clasificacion con id ${id} no se encontró`,
        status: HttpStatus.BAD_REQUEST

      }); //Template string
    }
    return clasificacion;
  }

  async update(id: number, updateClasificacionDto: UpdateClasificacionDto) {
    const {id_clasificacion:__,...data} = updateClasificacionDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.clasificacion.update({
      where:{id_clasificacion: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.clasificacion.delete({
      where: {id_clasificacion: id}
    });
  }
}
