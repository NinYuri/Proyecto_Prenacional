import { Test, TestingModule } from '@nestjs/testing';
import { FaseTorneoController } from './fase_torneo.controller';
import { FaseTorneoService } from './fase_torneo.service';

describe('FaseTorneoController', () => {
  let controller: FaseTorneoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaseTorneoController],
      providers: [FaseTorneoService],
    }).compile();

    controller = module.get<FaseTorneoController>(FaseTorneoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
