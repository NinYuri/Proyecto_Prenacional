import { Test, TestingModule } from '@nestjs/testing';
import { TecsController } from './tecs.controller';
import { TecsService } from './tecs.service';

describe('TecsController', () => {
  let controller: TecsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TecsController],
      providers: [TecsService],
    }).compile();

    controller = module.get<TecsController>(TecsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
