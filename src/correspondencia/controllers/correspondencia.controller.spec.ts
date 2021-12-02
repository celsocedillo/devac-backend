import { Test, TestingModule } from '@nestjs/testing';
import { CorrespondenciaController } from './correspondencia.controller';

describe('CorrespondenciaController', () => {
  let controller: CorrespondenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrespondenciaController],
    }).compile();

    controller = module.get<CorrespondenciaController>(CorrespondenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
