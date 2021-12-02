import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Tipos } from './entities/tipo.entity';
import { GeneralesController } from './controllers/generales.controller';
import { GeneralesService } from './services/generales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tipos])],
  controllers: [GeneralesController],
  providers: [GeneralesService]
})

export class GeneralesModule {}
