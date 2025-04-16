import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class GruposService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Jugador");
  }
  create(createGrupoDto: CreateGrupoDto) {
    return this.grupos.create({
      data: createGrupoDto 
    });
  }

  findAll() {
    return this.grupos.findMany();
  }

  
  async findOne(id: number) {
    const grupo = await this.grupos.findFirst({where:{id_grupo: id}});
       if(!grupo){
         throw new NotFoundException({
           message: `Grupo con id ${id} no se encontró`,
           status: HttpStatus.BAD_REQUEST
   
         }); //Template string
       }
       return grupo;
 }

    async  update(id: number, updateGrupoDto: UpdateGrupoDto) {
      const {id_grupo:__,...data} = updateGrupoDto      //desestructurar para que data tenga todos los elementos menos id
      await this.findOne(id);
      return this.grupos.update({
        where:{id_grupo: id},
        data: data,
        
  
      })
    }

  async remove(id: number) {
    await this.findOne(id);

    return this.grupos.delete({
      where: {id_grupo: id}
    });
  }
}
