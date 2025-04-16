import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DisciplinasService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Jugador");
  }
  create(createDisciplinaDto: CreateDisciplinaDto) {
    return this.diciplinas.create({
      data: createDisciplinaDto
    });
  }

  findAll() {
    return this.diciplinas.findMany();
  }
  async findOne(id: number) {
       const diciplina = await this.diciplinas.findFirst({where:{id_diciplinas: id}});
          if(!diciplina){
            throw new NotFoundException({
              message: `Diciplina con id ${id} no se encontró`,
              status: HttpStatus.BAD_REQUEST
      
            }); //Template string
          }
          return diciplina;
    }
  
    async  update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
      const {id_diciplinas:__,...data} = updateDisciplinaDto      //desestructurar para que data tenga todos los elementos menos id
      await this.findOne(id);
      return this.diciplinas.update({
        where:{id_diciplinas: id},
        data: data,
        
  
      })
    }
  
    async remove(id: number) {
      await this.findOne(id);
  
      return this.diciplinas.delete({
        where: {id_diciplinas: id}
      });
    }
}
