import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class EquipoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Equipo");
  }
  create(createEquipoDto: CreateEquipoDto) {
    return this.equipos.create({
      data: createEquipoDto 
    });
  } 

  async findAll() {
      return this.equipos.findMany();
  }

  async findOne(id: number) {
    const equipo = await this.equipos.findFirst({where:{id_equipo: id}});
    if(!equipo){
      throw new NotFoundException({
        message: `Equipo con id ${id} no se encontró`,
        status: HttpStatus.BAD_REQUEST

      }); //Template string
    }
    return equipo;
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    const {id_equipo:__,...data} = updateEquipoDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.equipos.update({
      where:{id_equipo: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.equipos.delete({
      where: {id_equipo: id}
    });
  }
}
