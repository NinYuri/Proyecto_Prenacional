import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JugadorService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Jugador");
  }
  create(createJugadorDto: CreateJugadorDto) {
    return this.jugadores.create({
      data: createJugadorDto 
    });
  }

  findAll() {
    return this.jugadores.findMany();
  }

  async findOne(id: number) {
     const jugador = await this.jugadores.findFirst({where:{id_jugador: id}});
        if(!jugador){
          throw new NotFoundException({
            message: `Jugador con id ${id} no se encontró`,
            status: HttpStatus.BAD_REQUEST
    
          }); //Template string
        }
        return jugador;
  }

  async  update(id: number, updateJugadorDto: UpdateJugadorDto) {
    const {id_jugador:__,...data} = updateJugadorDto      //desestructurar para que data tenga todos los elementos menos id
    await this.findOne(id);
    return this.jugadores.update({
      where:{id_jugador: id},
      data: data,
      

    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.jugadores.delete({
      where: {id_jugador: id}
    });
  }
}
