import { Test, TestingModule } from '@nestjs/testing';
import { PuntosdeinteresService } from './puntosdeinteres.service';

describe('PuntosdeinteresService', () => {
  let service: PuntosdeinteresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuntosdeinteresService],
    }).compile();

    service = module.get<PuntosdeinteresService>(PuntosdeinteresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
