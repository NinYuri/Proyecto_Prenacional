import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CanchaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Cancha");
  }
  create(createCanchaDto: CreateCanchaDto) {
    return this.canchas.create({
      data: createCanchaDto 
    });
  }

  async findAll() {
    return this.canchas.findMany();
  }

  async findOne(id: number) {
    const cancha = await this.canchas.findFirst({where:{id_cancha: id}});
        if(!cancha){
          throw new NotFoundException({
            message: `Cancha con id ${id} no se encontró`,
            status: HttpStatus.BAD_REQUEST
    
          }); //Template string
        }
        return cancha;
  }

  async update(id: number, updateCanchaDto: UpdateCanchaDto) {
    const {id_cancha:__,...data} = updateCanchaDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.canchas.update({
      where:{id_cancha: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.canchas.delete({
      where: {id_cancha: id}
    });
  }
}
