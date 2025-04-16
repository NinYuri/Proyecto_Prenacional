import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class RolesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('RolesService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Roles");
  }
  create(createRoleDto: CreateRoleDto) {
    return this.roles.create({
      data: createRoleDto 
    });
  }

  findAll() {
    return this.roles.findMany();
  }

  async findOne(id: number) {
     const roles = await this.roles.findFirst({where:{id_rol: id}});
        if(!roles){
          throw new NotFoundException({
            message: `Rol con id ${id} no se encontró`,
            status: HttpStatus.BAD_REQUEST
    
          }); //Template string
        }
        return roles;
  }

  async  update(id: number, updateRoleDto: UpdateRoleDto) {
    const {id_rol:__,...data} = updateRoleDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.roles.update({
      where:{id_rol: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.roles.delete({
      where: {id_rol: id}
    });
  }
}
