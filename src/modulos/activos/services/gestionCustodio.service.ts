import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from "moment";
import { Repository, getManager, RepositoryNotFoundError } from 'typeorm';
import { EaftaEntregaRecepcion} from '../entities/EaftaEntregaRecepcion'
import { EaftaEntregaRecepcionDetalle } from '../entities/EaftaEntregaRecepcionDetalle'
import { EaftaArea } from '../entities/EaftaArea';
import { VwActivoGeneral } from '../entities/VwActivoGeneral'
import { VwEmpleado } from '../../generales/entities/vwEmpleado.entity'
import { EaftaCustodio } from '../entities/EaftaCustodio'
import { Empleado } from '../../seguridad/entities/empleado.entity'
import { CreateSolicituCambioCustodioDto, 
         UpdateSolicituCambioCustodioDto, 
         CreateDetalleSolicitudCambioCustodioDto,
         UpdateDetalleSolicitudCambioCustodioDto,
         CreateActivoCustodioDto,
         UpdateActivoCustodioDto } from '../dtos/solicitudCambioCustodio.dto'


@Injectable()
export class GestionCustodioService {

    constructor (@InjectRepository(EaftaEntregaRecepcion) private entregaRecepcionRepository: Repository<EaftaEntregaRecepcion>,
                 @InjectRepository(EaftaEntregaRecepcionDetalle) private entregaRecepcionDetalleRepository: Repository<EaftaEntregaRecepcionDetalle>,
                 @InjectRepository(EaftaCustodio) private custodioRepository: Repository<EaftaCustodio>,
                 @InjectRepository(Empleado) private empleadoRepository: Repository<Empleado>,
                 @InjectRepository(VwEmpleado) private vwEmpleadoRepository: Repository<VwEmpleado>,
                 @InjectRepository(EaftaArea) private areaRepository: Repository<EaftaArea>,
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

    async getActa(anio: number, id: number){
        return await this.entregaRecepcionRepository.createQueryBuilder("acta")
        .where('acta.actaId = :id', {id: id})
        .andWhere('acta.actaAnio = :anio', {anio: anio})
        .leftJoinAndMapOne('acta.empleadoRecepta', Empleado, 'empleadoRecepta', 'acta.empleadoReceptaId = empleadoRecepta.codigo')
        .leftJoinAndMapOne('acta.empleadoEntrega', Empleado, 'empleadoEntrega', 'acta.empleadoEntregaId = empleadoEntrega.codigo')
        .leftJoin('acta.detalle', 'detalle')
        .leftJoin('detalle.activo', 'activo')
        .leftJoin('detalle.area', 'area')
        .select(["acta", 
                 'empleadoRecepta.empleado', 
                 'empleadoEntrega.empleado', 
                 'detalle', 
                 'activo.tipoActivo',
                 'activo.claseActivo',
                 'activo.descripcion',
                 'activo.codigoEcapag',
                 'activo.codigoActivoControl',
                 'area.descripcion'
                ])        
        .getOne();
    }

    async getActivosByCustodio(custodioId: number){
        return await this.custodioRepository.createQueryBuilder('activosCustodio')
        .where('activosCustodio.custodioPersonaId = :custodioId', {custodioId : custodioId})
        .andWhere("activosCustodio.estado = 'A'")
        .leftJoin('activosCustodio.activo', 'activo')
        .select(['activosCustodio', 
                 'activo.tipoActivo',
                 'activo.claseActivo',
                 'activo.codigoEcapag',
                 'activo.codigoActivoControl',
                 'activo.descripcion'])
        .getMany()
    }

    async getActasUsuario(custodioId: number, paginacion: any){
        const {pagina, numeroElementos} = paginacion;
        const query =  this.entregaRecepcionRepository
        .createQueryBuilder("acta")
        .leftJoinAndMapOne('acta.empleadoRecepta', Empleado, 'empleadoRecepta', 'acta.empleadoReceptaId = empleadoRecepta.codigo')
        .leftJoinAndMapOne('acta.empleadoEntrega', Empleado, 'empleadoEntrega', 'acta.empleadoEntregaId = empleadoEntrega.codigo')
        .where('acta.empleadoEntregaId = :custodioId', {custodioId: custodioId})
        .select(["acta", 'empleadoRecepta.empleado', 'empleadoEntrega.empleado', 'empleadoRecepta.direccionId'])        
        .orderBy('acta.fechaIngresa', 'DESC')
        const totalRows = await query.getCount();

        if (pagina){
            let skip = pagina === 1 ? 0 : ((pagina-1) * numeroElementos)
            query.skip(skip).take(numeroElementos)
        }

        return {data: await query.getMany(), totalRows};
    }

    async createSolicitudCambioEstado(data: CreateSolicituCambioCustodioDto){
        console.log('data', data);
        const actaAnio = new Date().getFullYear();
        const newSequence = await this.getNewSecuenciaSolicitudCambioEstado(actaAnio) + 1;
        //let {detalle, ...newRecord} = data
        let newRecord = {...data,
            estado: 'EA',
            actaId: newSequence,
            actaAnio,
            tipo: 'C',
            fechaActa: moment(new Date()).format('YYYY-MM-DD'),
            fechaIngresa: moment(new Date()).format('YYYY-MM-DD'),
            detalle:[]
        }
        await this.entregaRecepcionRepository.save(newRecord);
        let detalle = [];
        for (let i = 0; i < data.detalle.length; i++){
            let newDetalle = {actaId: newRecord.actaId, actaAnio: newRecord.actaAnio, activoId: data.detalle[i].activoId};
            const respuesta = await this.createDetalleSolicitudCambioEstado(newDetalle);
            console.log('devolviendo nuevo detalle', respuesta);
            detalle.push(respuesta);
        }
        newRecord = {...newRecord, detalle}
        console.log('nueva acta creada ', newRecord);
        return  newRecord;
    }

    async updateSolicitudCambioEstado(data: UpdateSolicituCambioCustodioDto){
       let registro = await this.entregaRecepcionRepository.findOne({where : {actaId: data.actaId, actaAnio: data.actaAnio}});
       this.entregaRecepcionRepository.merge(registro, data);
       const {detalle, ...actualizar} = registro
       return this.entregaRecepcionRepository.save(actualizar);
    }

    //async createDetalleSolicitudCambioEstado(activoId: number, actaId: number, actaAnio: number){
    async createDetalleSolicitudCambioEstado(payload: CreateDetalleSolicitudCambioCustodioDto){   
        console.log('detalle', payload);     
        return await this.entregaRecepcionDetalleRepository.save({
            actaId: payload.actaId,
            actaAnio: payload.actaAnio,
            actadetId: await this.getNewSecuenciaDetalleSolicitud(),
            activoId: payload.activoId,
            estado: 'IN',
            estadoActivo: 'IN'
        })
    }

    async areaDetalleSolicitudCambioEstado(actadetId: number, actaAnio: number, actaId: number, areaId: number, todos: boolean){
        if (todos){
            // let query = this.entregaRecepcionDetalleRepository.createQueryBuilder()
            // .update(EaftaEntregaRecepcionDetalle)
            // .set({areaId: areaId})
            // .where("actaAnio = :actaAnio", {actaAnio: actaAnio})
            // .andWhere("actaId = :actaId", {actaId: actaId})
            // console.log('update', query.getSql())            
            // await query.execute()
            await this.entregaRecepcionDetalleRepository.update({actaAnio: actaAnio, actaId: actaId}, {areaId: areaId} )
        }else{
            await this.entregaRecepcionDetalleRepository.update({actadetId: actadetId}, {areaId: areaId} )
            // let query =  this.entregaRecepcionDetalleRepository.createQueryBuilder()
            // .update(EaftaEntregaRecepcionDetalle)
            // .set({areaId: areaId})
            // .where("actadetId = :actadetId", {actadetId: actadetId})
            // console.log('update', query.getSql())            
            // await query.execute()            
        }
        return true;
     }
 

    async deleteDetalleSolicitudCambioEstado(activodetId: number){
        return await this.entregaRecepcionDetalleRepository.delete(activodetId);
    }

    async getNewSecuenciaDetalleSolicitud(){
        let qrySecuencia = `select EAFSE_ENTREGA_RECEPCION_DET.nextval from dual`
        const resSecuencia = await getManager().query(qrySecuencia);
        return resSecuencia[0].NEXTVAL;
    }

    async getNewSecuenciaSolicitudCambioEstado(anio: number){
        let query = this.entregaRecepcionRepository.createQueryBuilder("acta")
        .select("MAX(acta.actaId)", "secuencia")
        .where("acta.actaAnio = :anio", {anio: anio})
        const resultado = await query.getRawOne();
        if (resultado?.secuencia) return resultado.secuencia
        else return 0
    }

    async getListaSolicitudCambioCustdioByAdministrador(usuario: string, filtro: any){
        console.log('filtro', filtro);
        const {pagina, numeroElementos, estado} = filtro;
        let administrativo = await this.vwEmpleadoRepository.createQueryBuilder("empleado")
        .select("empleado")
        .where("empleado.usuario = :usuario", {usuario: usuario})
        .getOne()

        const query = this.entregaRecepcionRepository
        .createQueryBuilder("acta")
        .leftJoinAndMapOne('acta.empleadoRecepta', Empleado, 'empleadoRecepta', 'acta.empleadoReceptaId = empleadoRecepta.codigo')
        .leftJoinAndMapOne('acta.empleadoEntrega', Empleado, 'empleadoEntrega', 'acta.empleadoEntregaId = empleadoEntrega.codigo')
        .where('acta.direccionId = :direccionId', {direccionId: administrativo.direccionId})
        .select(["acta", 'empleadoRecepta.empleado', 'empleadoEntrega.empleado', 'empleadoRecepta.direccionId'])        
        .orderBy('acta.fechaIngresa', 'DESC')

        if (estado){
            query.andWhere('acta.estado = :estado', {estado: estado})
        }
        const totalRows = await query.getCount();
        if (pagina){
            let skip = pagina === 1 ? 0 : ((pagina-1) * numeroElementos)
            query.skip(skip).take(numeroElementos)
        }
        return  {data: await query.getMany(), totalRows};
    }

    async apruebaSolicitudCambioCustodio(actaAnio: number, actaId: number, usuarioAprueba: string){
        try{
            let query = `begin EAFPR_PROCESA_SOLICITUD_CAMBIO(${actaAnio}, ${actaId}, '${usuarioAprueba}'); end;`
            const resultado = await getManager().query(query);
            console.log('resultado', resultado);
            return true;
        }catch(err){
            throw new Error(err);
        }
    }

    // async apruebaSolicitudCambioCustodio(actaAnio: number, actaId: number, usuarioAprueba: string){
    //     let acta = await this.entregaRecepcionRepository.findOne({where : {actaId: actaId, actaAnio: actaAnio}});

    //     //Procesa los activos
    //     acta.detalle.map( async  i =>{
    //         //Busca el actual custodio
    //         let activoCustodio = await this.custodioRepository.findOne({where: [{
    //             activoId: i.activoId,
    //             estado: 'A'}]
    //         })
    //         activoCustodio.estado = 'I'
    //         //Inactivo el actual custodio
    //         await this.updateActivoCustodio(activoCustodio);
    //         //Se crea el nuevo registro para el nuevo custodio
    //         let nuevoCustodio = {
    //             custodioPersonaId: acta.empleadoReceptaId,
    //             activoId: i.activoId,
    //             observacion: '',
    //             usuarioIngresa: acta.usuarioAprueba,
    //             estado: 'A'
    //         }
    //         await this.createActivoCustodio(nuevoCustodio);
    //     })

    //     //se deja a un lado el detalle
    //     let {detalle, ...actualizar } = acta;

    //     actualizar = {...actualizar, 
    //         estado : 'AP',
    //         usuarioAprueba: usuarioAprueba,
    //         fechaAprueba: new Date()
    //     }

    //     //Una vez procesado todo el detalle se cambia el estado de la solicitud
    //     return await this.updateSolicitudCambioEstado(actualizar);

    // }

    async aprobarDetalleSolicitudCambioCustodio(payload: UpdateDetalleSolicitudCambioCustodioDto){
        let registro = await this.entregaRecepcionDetalleRepository.findOne({where : {actadetId: payload.actadetId}});
        this.entregaRecepcionDetalleRepository.merge(registro, payload);
        return this.entregaRecepcionDetalleRepository.save(registro);
    }

    async createActivoCustodio(payload: CreateActivoCustodioDto){
        let registro = {...payload,
            custodioId: await this.getNextValSecuencia('EAFSC_CUSTODIO'),
            fechaIngresa: moment(new Date()).format('YYYY-MM-DD')
        }
        return this.custodioRepository.save(registro);
    }

    async updateActivoCustodio(payload: UpdateActivoCustodioDto){
        let registro = await this.custodioRepository.findOne({where: {custodioId: payload.custodioId}})
        this.custodioRepository.merge(registro, payload);
        return await this.custodioRepository.save(registro);
    }

    async getNextValSecuencia(objetoSecuencia: string){
        let qrySecuencia = `select ${objetoSecuencia}.nextval from dual`
        const resSecuencia = await getManager().query(qrySecuencia);
        return resSecuencia[0].NEXTVAL;
    }

    async getAreas(direccionId: number){
        return await this.areaRepository.createQueryBuilder('area')
        .where('area.departamentoId = :direccionId', {direccionId : direccionId})
        .andWhere("area.estado = 'A'")
        .getMany()
    }
    
}
