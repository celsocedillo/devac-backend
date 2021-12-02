import { Test, TestingModule } from '@nestjs/testing';
import { GeneralesController } from './generales.controller';

describe('GeneralesController', () => {
  let controller: GeneralesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralesController],
    }).compile();

    controller = module.get<GeneralesController>(GeneralesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
