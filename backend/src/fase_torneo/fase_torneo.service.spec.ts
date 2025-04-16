import { Test, TestingModule } from '@nestjs/testing';
import { FaseTorneoService } from './fase_torneo.service';

describe('FaseTorneoService', () => {
  let service: FaseTorneoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaseTorneoService],
    }).compile();

    service = module.get<FaseTorneoService>(FaseTorneoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
