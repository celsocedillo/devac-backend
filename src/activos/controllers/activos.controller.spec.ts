import { Test, TestingModule } from '@nestjs/testing';
import { ActivosController } from './activos.controller';

describe('ActivosController', () => {
  let controller: ActivosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivosController],
    }).compile();

    controller = module.get<ActivosController>(ActivosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
