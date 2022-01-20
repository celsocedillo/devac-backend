import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservaOficio } from '../entities/reservaOficio.entity';
import { ReservaSecuencia } from '../entities/reservaSecuencia.entity';
import { TipoOficio } from '../entities/tipoOficio.entity';

import { CreateReservaOficioDto, UpdateReservaOficioDto } from '../dtos/reservaOficio.dto'
import { UpdateSecuenciaOficioDto } from '../dtos/secuenciaOficio.dto'
import * as moment from "moment";
import { Repository, getManager } from 'typeorm';
import { timeStamp } from 'console';


@Injectable()
export class ReservaService {

    constructor(@InjectRepository(ReservaOficio) private reservaOficioRepo: Repository<ReservaOficio>,
                @InjectRepository(TipoOficio) private tipoOficioRepo: Repository<TipoOficio>,
                @InjectRepository(ReservaSecuencia) private reservaSecuenciaRepo: Repository<ReservaSecuencia>
               ){

    }

    async getReservas(tipoOficioId :number, direccionId: number, anio :number, ppagina :number){
        let query = `select res.tof_codigo "tipoOficio", tof_descripcion "tipoOficio", nro_oficio "numeroOficio", anio "anioOficio", 
                     destinatario "destinatarioId", copia "copia", asunto "asunto", fecha_impresion "fechaImpresion", 
                     dpto "departamentoId", usuario "usuario", fecha_ingreso "fechaIngreso", res.estado "estado", 
                     fecha_estado "fechaEstado", observacion "observacion", desc_destinatario "referenciaDestinatario",
                     usuario_anula "usuarioAnula", fecha_anula "fechaAnula", motivo_anula "motivoAnula", 
                     usuario_reasigna "usuarioReasigna", fecha_reasigna "fechaReasigna", motivo_reasigna "motivoReasigna"
                     from erco.co_numero_oficio res
                     join cr_tip_oficio tof on tof.tof_codigo = res.tof_codigo
                     join erco.cr_departamentos_n cdep on cdep.id_departamento = res.dpto and cdep.direccion_id = ${direccionId}
                     where res.tof_codigo = ${tipoOficioId} and anio=${anio}
                      `
        return await getManager().query(query);
    }

    async getReservasByDireccion(pdireccionId: number, params: any){
        const {pagina, tipoOficioId, destinatario, asunto, estado } = params
        const fechaDesde = moment(new Date(params.fechaDesde)).format('YYYY-MM-DD')
        const fechaHasta = moment(new Date(params.fechaHasta)).format('YYYY-MM-DD')
        let skip = 0;
        if ( parseInt(pagina) > 1){
            skip = (parseInt(pagina)-1) * 20;
        }
        const qb = this.reservaOficioRepo.createQueryBuilder("reservas")
        .leftJoinAndSelect("reservas.tipoOficio", "tipoOficio")
        .leftJoinAndSelect('reservas.direccionNomina', "direccionNomina")
        .where('reservas.direccionId = :direccionId', {direccionId: pdireccionId})
        .select(['reservas', 'tipoOficio.descripcion', 'direccionNomina.direccion'])
        .orderBy('reservas.fechaIngreso', 'DESC')

        if (params.fechaDesde && params.fechaHasta){
            qb.andWhere("reservas.fechaIngreso between to_date(:fechaDesde,'YYYY-MM-DD') and to_date(:fechaHasta,'YYYY-MM-DD')", 
            {fechaDesde: fechaDesde, fechaHasta: fechaHasta})
        }
        
        if (tipoOficioId){
            qb.andWhere('reservas.tipoOficioId = :tipoId', {tipoId: tipoOficioId});
        }
        if (destinatario){
            qb.andWhere("reservas.referenciaDestinatario like :destinatario", {destinatario: `%${destinatario}%`})
        }
        if (asunto){
            qb.andWhere("reservas.asunto like :asunto", {asunto: `%${asunto}%`})
        }
        if (estado){
            qb.andWhere("reservas.estado = :estado", {estado: estado})
        }
        const totalRows = await qb.getCount();
        qb.take(20)
        .skip(skip);
        const data = await qb.getMany();
        return {data, totalRows}
    }

    async getTipoOFicioByDireccion(pdireccionId: number){
        return this.tipoOficioRepo.find({
            where: [{tipo: 'I', departamentoId : pdireccionId},
                    {tipo: 'G'}]
        });
    }

    async getTipoOFicioByDireccionActivos(pdireccionId: number){
        return this.tipoOficioRepo.find({
            where: [{tipo: 'I', departamentoId : pdireccionId, estado: 'A'},
                    {tipo: 'G', estado: 'A'}]
        });
    }

    async getReservaByNumero(ptipoOficioId: number, panio: number, pnumeroOficio: number){
        return   this.reservaOficioRepo.createQueryBuilder("reservas")
        .leftJoinAndSelect("reservas.tipoOficio", "tipoOficio")
        .leftJoinAndSelect('reservas.direccionNomina', "direccionNomina")
        .where('reservas.tipoOficioId = :tipoOficioId', {tipoOficioId: ptipoOficioId})
        .andWhere('reservas.anio = :anio', {anio: panio})
        .andWhere('reservas.numeroOficio = :numeroOficio', {numeroOficio: pnumeroOficio})
        .select(['reservas', 'tipoOficio.descripcion', 'direccionNomina.direccion'])
        .orderBy('reservas.fechaIngreso', 'DESC')
        .getOne();
    }

    async getSecuenciaActual(ptipoOficioId: number, panio: number){
        return this.reservaSecuenciaRepo.createQueryBuilder("secuencia")
        .select("secuencia")
        .where("secuencia.tipoOficioId = :tipoOficioId", {tipoOficioId: ptipoOficioId})
        .andWhere("secuencia.anio = :anio", {anio: panio})
        .getOne()
    
    }

    async createReservaOficio(data: CreateReservaOficioDto){
        console.log('service', data);
        let secuencia = await this.getSecuenciaActual(data.tipoOficioId, data.anio);
        if (!secuencia){
            secuencia = {
                tipoOficioId: data.tipoOficioId,
                anio: data.anio,
                numeroOficio : 0
            }
            await this.reservaSecuenciaRepo.save(secuencia);
        }

        const registro = this.reservaOficioRepo.create(data);
        registro.fechaIngreso = new Date;
        registro.numeroOficio = secuencia.numeroOficio + 1;
        //actualizar secuencia 
        const tipSecuencia = {
            anio: data.anio,
            tipoOficioId: data.tipoOficioId,
            numeroOficio : secuencia.numeroOficio + 1
        }
         
        this.updateSecuenciaOficio(tipSecuencia);
        return  this.reservaOficioRepo.save(registro);
    }

    async updateReservaOficio(numeroOficio:number, data: UpdateReservaOficioDto){
        const registro = await this.reservaOficioRepo.findOne({where : {tipoOficioId: data.tipoOficioId, anio: data.anio, numeroOficio: numeroOficio}});
        this.reservaOficioRepo.merge(registro, data);
        return this.reservaOficioRepo.save(registro);
    }

    async updateSecuenciaOficio(data: UpdateSecuenciaOficioDto){
        const secuencia = await this.reservaSecuenciaRepo.findOne({ where: { tipoOficioId: data.tipoOficioId, anio: data.anio } });
        this.reservaSecuenciaRepo.merge(secuencia, data);
        return this.reservaSecuenciaRepo.save(secuencia);
    }



    

}
