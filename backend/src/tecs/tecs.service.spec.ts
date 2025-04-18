import { Test, TestingModule } from '@nestjs/testing';
import { TecsService } from './tecs.service';

describe('TecsService', () => {
  let service: TecsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TecsService],
    }).compile();

    service = module.get<TecsService>(TecsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
