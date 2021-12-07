import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActivosController } from './controllers/activos.controller';
import { ActivosService } from './services/activos.service';
import { ActasService } from './services/actas.service';
import { EaftaActa } from './entities/EaftaActa';
import { EaftaActaDetalle } from './entities/EaftaActaDetalle';
import { EaftaEstadoSituacion  } from './entities/EaftaEstadoSituacion';
import { VwActivoGeneral } from './entities/VwActivoGeneral';
import { EaftaPermisoEstado } from './entities/EaftaPermisoEstado';

@Module({
  imports: [TypeOrmModule.forFeature([EaftaActa, EaftaActaDetalle, EaftaEstadoSituacion, VwActivoGeneral, EaftaPermisoEstado])],
  controllers: [ActivosController],
  providers: [ActivosService, ActasService]
})
export class ActivosModule {}
