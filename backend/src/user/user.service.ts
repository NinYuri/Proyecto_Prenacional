import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada User");
  }
  create(createUserDto: CreateUserDto) {
    return this.usuarios.create({
      data: createUserDto 
    });
  }

  async findAll() {
    return this.usuarios.findMany();
}

   async findOne(id: number) {
     const user = await this.usuarios.findFirst({where:{id_user: id}});
     if(!user){
       throw new NotFoundException({
         message: `Equipo con id ${id} no se encontró`,
         status: HttpStatus.BAD_REQUEST
 
       }); //Template string
     }
     return user;
   }

   async update(id: number, updateUserDto: UpdateUserDto) {
    const {id_user:__,...data} = updateUserDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.usuarios.update({
      where:{id_user: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.usuarios.delete({
      where: {id_user: id}
    });
  }
}
