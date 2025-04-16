import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PartidoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PartidoService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Jugador");
  }
  create(createPartidoDto: CreatePartidoDto) {
    return this.partidos.create({
      data: createPartidoDto 
    });
  }

  findAll() {
    return this.partidos.findMany();
  }

  async findOne(id: number) {
       const partido = await this.partidos.findFirst({where:{id_partido: id}});
          if(!partido){
            throw new NotFoundException({
              message: `Jugador con id ${id} no se encontró`,
              status: HttpStatus.BAD_REQUEST
      
            }); //Template string
          }
          return partido;
    }

  async  update(id: number, updatePartidoDto: UpdatePartidoDto) {
    const {id_partido:__,...data} = updatePartidoDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.partidos.update({
      where:{id_partido: id},
      data: data,
      

    })
  }

  
  async remove(id: number) {
    await this.findOne(id);

    return this.partidos.delete({
      where: {id_partido: id}
    });
  }
}
