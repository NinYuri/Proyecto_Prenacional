import { Test, TestingModule } from '@nestjs/testing';
import { RoldejuegosController } from './roldejuegos.controller';
import { RoldejuegosService } from './roldejuegos.service';

describe('RoldejuegosController', () => {
  let controller: RoldejuegosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoldejuegosController],
      providers: [RoldejuegosService],
    }).compile();

    controller = module.get<RoldejuegosController>(RoldejuegosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
