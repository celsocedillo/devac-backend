import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Tipos } from './entities/tipo.entity';
import { VwDireccionNomina } from './entities/vwDireccionNomina.entity'
import { GeneralesController } from './controllers/generales.controller';
import { GeneralesService } from './services/generales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tipos, VwDireccionNomina])],
  controllers: [GeneralesController],
  providers: [GeneralesService],
  exports: [GeneralesService, TypeOrmModule]
})

export class GeneralesModule {}
