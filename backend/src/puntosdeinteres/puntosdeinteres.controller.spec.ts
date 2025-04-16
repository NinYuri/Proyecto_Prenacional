import { Test, TestingModule } from '@nestjs/testing';
import { PuntosdeinteresController } from './puntosdeinteres.controller';
import { PuntosdeinteresService } from './puntosdeinteres.service';

describe('PuntosdeinteresController', () => {
  let controller: PuntosdeinteresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuntosdeinteresController],
      providers: [PuntosdeinteresService],
    }).compile();

    controller = module.get<PuntosdeinteresController>(PuntosdeinteresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
