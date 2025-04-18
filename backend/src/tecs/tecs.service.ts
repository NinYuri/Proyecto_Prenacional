import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateTecDto } from './dto/create-tec.dto';
import { UpdateTecDto } from './dto/update-tec.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TecsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('TecService')
  onModuleInit() {
    this.$connect();
    this.logger.log("Base de datos conectada Tec");
  }

  create(createTecDto: CreateTecDto) {
    return this.tecs.create({
      data: createTecDto
    });
  }

  findAll() {
    return this.tecs.findMany();
  }

  async findOne(id: number) {
    const tec = await this.tecs.findFirst({ where: { id_tecs: id } });
    if (!tec) {
      throw new NotFoundException({
        message: `Tec con id ${id} no se encontró`,
        status: HttpStatus.BAD_REQUEST
      });
    }
    return tec;
  }

  async update(id: number, updateTecDto: UpdateTecDto) {
    const { id_tecs:__, ...data } = updateTecDto
    await this.findOne(id);
    return this.tecs.update({
      where: { id_tecs: id },
      data: data,
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.tecs.delete({
      where: { id_tecs: id }
    });
  }
}
