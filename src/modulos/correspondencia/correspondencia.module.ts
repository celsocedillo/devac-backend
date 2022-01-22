import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Estado} from '../correspondencia/entities/estado.entity'
import { TipoOficio } from './entities/tipoOficio.entity'
import { ReservaOficio } from './entities/reservaOficio.entity'
import { ReservaSecuencia} from './entities/reservaSecuencia.entity';
import { CorrespondenciaController } from '../correspondencia/controllers/correspondencia.controller';
import { CorrespondenciaService} from '../correspondencia/services/correspondencia.service';
import { ReservaController } from './controllers/reserva.controller';
import { ReservaService } from './services/reserva.service';
import { GeneralesModule } from '../generales/generales.module'

@Module({
  imports: [GeneralesModule, TypeOrmModule.forFeature([Estado, ReservaOficio, TipoOficio, ReservaSecuencia])],
  controllers: [CorrespondenciaController, ReservaController],
  providers: [CorrespondenciaService, ReservaService]
})
export class CorrespondenciaModule {}
