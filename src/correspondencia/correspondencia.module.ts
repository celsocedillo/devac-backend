import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Estado} from './entities/estado.entity'
import { CorrespondenciaController } from './controllers/correspondencia.controller';
import { CorrespondenciaService} from './services/correspondencia.service';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  controllers: [CorrespondenciaController],
  providers: [CorrespondenciaService]
})
export class CorrespondenciaModule {}
