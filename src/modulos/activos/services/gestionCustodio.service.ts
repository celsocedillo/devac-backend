import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from "moment";
import { Repository, getManager } from 'typeorm';
import { EaftaEntregaRecepcion} from '../entities/EaftaEntregaRecepcion'
import { EaftaEntregaRecepcionDetalle } from '../entities/EaftaEntregaRecepcionDetalle'
import { VwActivoGeneral } from '../entities/VwActivoGeneral'
import { EaftaCustodio } from '../entities/EaftaCustodio'
import { Empleado } from '../../seguridad/entities/empleado.entity'



@Injectable()
export class GestionCustodioService {
    constructor (@InjectRepository(EaftaEntregaRecepcion) private entregaRecepcionRepository: Repository<EaftaEntregaRecepcion>,
                 @InjectRepository(EaftaEntregaRecepcionDetalle) private entregaRecepcionDetalleRepository: Repository<EaftaEntregaRecepcionDetalle>,
                 @InjectRepository(EaftaCustodio) private custodioRepository: Repository<EaftaCustodio>,
                 @InjectRepository(Empleado) private empleadoRepository: Repository<Empleado>,
                ){
    }

    async getActas() {
        return await this.entregaRecepcionRepository
        .createQueryBuilder("acta")
        .leftJoinAndMapOne('acta.empleadoRecepta', Empleado, 'empleadoRecepta', 'acta.empleadoReceptaId = empleadoRecepta.codigo')
        .leftJoinAndMapOne('acta.empleadoEntrega', Empleado, 'empleadoEntrega', 'acta.empleadoEntregaId = empleadoEntrega.codigo')
        .select(["acta", 'empleadoRecepta.empleado', 'empleadoEntrega.empleado', 'empleadoRecepta.direccionId'])        
        .getMany();
    }

    async getActa(id: number){
        return await this.entregaRecepcionRepository.createQueryBuilder("acta")
        .where('acta.actaId = :id', {id: id})
        .leftJoinAndMapOne('acta.empleadoRecepta', Empleado, 'empleadoRecepta', 'acta.empleadoReceptaId = empleadoRecepta.codigo')
        .leftJoinAndMapOne('acta.empleadoEntrega', Empleado, 'empleadoEntrega', 'acta.empleadoEntregaId = empleadoEntrega.codigo')
        .leftJoin('acta.detalle', 'detalle')
        .leftJoin('detalle.activo', 'activo')
        .leftJoin('detalle.area', 'area')
        .select(["acta", 
                 'empleadoRecepta.empleado', 
                 'empleadoEntrega.empleado', 
                 'detalle', 
                 'activo.descripcion',
                 'activo.codigoEcapag',
                 'area.descripcion'
                ])        
        .getOne();
    }

    async getActivosByCustodio(custodioId: number){
        return await this.custodioRepository.createQueryBuilder('activosCustodio')
        .where('activosCustodio.custodioPersonaId = :custodioId', {custodioId : custodioId})
        .leftJoin('activosCustodio.activo', 'activo')
        .select(['activosCustodio', 
                 'activo.codigoEcapag',
                 'activo.descripcion'])
        .getMany()
    }
    
}
