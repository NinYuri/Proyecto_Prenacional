import { Test, TestingModule } from '@nestjs/testing';
import { RoldejuegosService } from './roldejuegos.service';

describe('RoldejuegosService', () => {
  let service: RoldejuegosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoldejuegosService],
    }).compile();

    service = module.get<RoldejuegosService>(RoldejuegosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
