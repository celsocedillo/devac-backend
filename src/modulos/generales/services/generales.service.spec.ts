import { Test, TestingModule } from '@nestjs/testing';
import { GeneralesService } from './generales.service';

describe('GeneralesService', () => {
  let service: GeneralesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralesService],
    }).compile();

    service = module.get<GeneralesService>(GeneralesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
