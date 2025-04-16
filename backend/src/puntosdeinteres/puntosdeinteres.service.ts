import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePuntosdeintereDto } from './dto/create-puntosdeintere.dto';
import { UpdatePuntosdeintereDto } from './dto/update-puntosdeintere.dto';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PuntosdeinteresService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Puntosdeinteres");
  }
  create(createPuntosdeintereDto: CreatePuntosdeintereDto) {
    return this.puntosdeInteres.create({
      data: createPuntosdeintereDto 
    });
  }

  findAll() {
    return this.puntosdeInteres.findMany();
  }

  async findOne(id: number) {
    const puntos = await this.puntosdeInteres.findFirst({where:{id_PuntosdeInteres: id}});
       if(!puntos){
         throw new NotFoundException({
           message: `Punto de Interes con id ${id} no se encontró`,
           status: HttpStatus.BAD_REQUEST
   
         }); //Template string
       }
       return puntos;
 }

  async  update(id: number, updatePuntosdeintereDto: UpdatePuntosdeintereDto) {
     const {id_PuntosdeInteres:__,...data} = updatePuntosdeintereDto      //desestructurar para que data tenga todos los elementos menos id
     await this.findOne(id);
     return this.puntosdeInteres.update({
       where:{id_PuntosdeInteres: id},
       data: data,
       
 
     })
   }

  async remove(id: number) {
    await this.findOne(id);

    return this.puntosdeInteres.delete({
      where: {id_PuntosdeInteres: id}
    });
  }
}
