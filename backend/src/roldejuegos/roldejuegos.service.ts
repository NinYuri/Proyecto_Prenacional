import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateRoldejuegoDto } from './dto/create-roldejuego.dto';
import { UpdateRoldejuegoDto } from './dto/update-roldejuego.dto';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class RoldejuegosService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('RoldejuegosService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Roldejuegos");
  }
  create(createRoldejuegoDto: CreateRoldejuegoDto) {
    return this.rolDeJuegos.create({
      data: createRoldejuegoDto
    });
  }

  findAll() {
    return this.rolDeJuegos.findMany();
  }

  async findOne(id: number) {
    const rol = await this.rolDeJuegos.findFirst({where:{id_RolDeJuegos: id}});
       if(!rol){
         throw new NotFoundException({
           message: `Rol con id ${id} no se encontró`,
           status: HttpStatus.BAD_REQUEST
   
         }); //Template string
       }
       return rol;
 }

  async  update(id: number, updateRoldejuegoDto: UpdateRoldejuegoDto) {
     const {id_RolDeJuegos:__,...data} = updateRoldejuegoDto      //desestructurar para que data tenga todos los elementos menos id
     await this.findOne(id);
     return this.rolDeJuegos.update({
       where:{id_RolDeJuegos: id},
       data: data,
       
 
     })
   }
 
   async remove(id: number) {
     await this.findOne(id);
 
     return this.rolDeJuegos.delete({
       where: {id_RolDeJuegos: id}
     });
   }
}
