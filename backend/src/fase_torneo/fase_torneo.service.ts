import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateFaseTorneoDto } from './dto/create-fase_torneo.dto';
import { UpdateFaseTorneoDto } from './dto/update-fase_torneo.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
@Injectable()
export class FaseTorneoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Fase_torneo");
  }
  create(createFaseTorneoDto: CreateFaseTorneoDto) {
    return this.fasesTorneo.create({
      data: createFaseTorneoDto 
    });
  }

  async findAll() {
    return this.fasesTorneo.findMany();
  }

  async findOne(id: number) {
    const fase_torneo = await this.fasesTorneo.findFirst({where:{id_fase_torneo: id}});
        if(!fase_torneo){
          throw new NotFoundException({
            message: `Fase_torneo con id ${id} no se encontró`,
            status: HttpStatus.BAD_REQUEST
    
          }); //Template string
        }
        return fase_torneo;
  }

  async update(id: number, updateFaseTorneoDto: UpdateFaseTorneoDto) {
    const {id_fase_torneo:__,...data} = updateFaseTorneoDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.fasesTorneo.update({
      where:{id_fase_torneo: id},
      data: data,
      

    })
  }

  async  remove(id: number) {
    await this.findOne(id);

    return this.fasesTorneo.delete({
      where: {id_fase_torneo: id}
    });
  }
}
