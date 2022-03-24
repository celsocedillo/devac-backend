import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActivosController } from './controllers/activos.controller';
import { GestionCustodioController } from './controllers/gestionCustodio.controller';

import { ActivosService } from './services/activos.service';
import { ActasService } from './services/actas.service';
import { GestionCustodioService} from './services/gestionCustodio.service'

import { EaftaActa } from './entities/EaftaActa';
import { EaftaActaDetalle } from './entities/EaftaActaDetalle';
import { EaftaEstadoSituacion  } from './entities/EaftaEstadoSituacion';
import { VwActivoGeneral } from './entities/VwActivoGeneral';
import { EaftaPermisoEstado } from './entities/EaftaPermisoEstado';
import { EaftaEntregaRecepcion } from './entities/EaftaEntregaRecepcion'
import { EaftaArea } from './entities/EaftaArea'
import { EaftaEntregaRecepcionDetalle } from './entities/EaftaEntregaRecepcionDetalle'
import { EaftaCustodio } from './entities/EaftaCustodio'

import { Empleado } from '../seguridad/entities/empleado.entity'
import { VwEmpleado } from '../generales/entities/vwEmpleado.entity'

@Module({
  imports: [TypeOrmModule.forFeature(
    [EaftaActa, 
     EaftaActaDetalle, 
     EaftaEstadoSituacion, 
     VwActivoGeneral, 
     VwEmpleado,
     EaftaPermisoEstado,
     EaftaEntregaRecepcion,
     EaftaEntregaRecepcionDetalle,
     EaftaArea,
     EaftaCustodio,
     Empleado
    ])],
  controllers: [ActivosController, GestionCustodioController],
  providers: [ActivosService, ActasService, GestionCustodioService]
})
export class ActivosModule {}
