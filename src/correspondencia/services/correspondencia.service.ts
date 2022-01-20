import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from "moment";
import { Repository, getManager } from 'typeorm';
import {  Estado } from '../entities/estado.entity'
import {  TipoOficio } from '../entities/tipoOficio.entity'

@Injectable()
export class CorrespondenciaService {

    constructor(@InjectRepository(Estado) private estadoRepo: Repository<Estado>){
    }

    async getSumillasDireccion(pdireccionId: number, pestado: string, ppagina: number, panio: number, pregistro: number){
        try{
            let numeroPaginas = 20;
            let totalRows=0;
            let where = '';
            let qOffset = '';
            let offset =0;
            let totalEnEspera = 0;
            //Inicio del query
            let query = `select id_registro "idRegistro", id_sec_registro "id", tip_oficio "tipoOficio", digitos "digitos", anio "anio", fecha_ingreso "fechaIngreso", 
            cabe_usuario_ingresa "usuarioIngresa", cabe_tipo_documento "tipoDocumento", tipo_registro "tipoRegistro",
            sumi.registro_dpto "registroDepartamento", id_usuario_origen "idUsuarioOrigen", usuario_origen "usuarioOrigen",
            dpto_origen "departamentoOrigen", id_usuario_destino "idUsuarioDestino", usuario_destino "usuarioDestino",
            dpto_destino "departamentoDestino", asunto "asunto", sumillado "sumillado", 
            sumi_id_usuario_destino "sumillaIdUsuarioDestino", sumi_usuario_destino "sumillaUsuarioDestino",
            sumi_dpto_destino "sumillaDepartamentoDestino", sumi_estado_usuarios "sumillaEstado", sumilla "sumilla", sumi.siglas "siglas",
            round(sysdate - fecha_sumilla) "diasEspera",
            fecha_sumilla "fechaSumilla"
            from erco.vw_oficio_sumilla sumi
            join erco.cr_departamentos_n dep on dep.id_departamento = sumi_id_dpto`
            where = `where sumillado = 'S'  
                     and dep.direccion_id = ${pdireccionId}`

            //Segun el filtro aplicado, se arma el where con los estados seleccionados
            if (pestado === 'S' || pestado === 'C') {
                where = `${where} and sumi_estado_usuarios = '${pestado}'`
            }else if (pestado === 'O'){
                where = `${where} and sumi_estado_usuarios not in ('C','S')`
            }

            //Si es la primera consulta, entonces se consulta el total de sumillas pendientes del area

            if (ppagina == 1 && pestado === 'T'){
                console.log('Buscando en espera')
                let query = `select count(*) "totalEnEspera" from erco.vw_oficio_sumilla sumi
                join erco.cr_departamentos_n dep on dep.id_departamento = sumi_id_dpto 
                where sumillado='S' and dep.direccion_id = ${pdireccionId} and  sumi_estado_usuarios = 'S'`
                const result = await getManager().query(query);    
                totalEnEspera = result[0].totalEnEspera
            }

            if (pregistro > 0) {
                where = `${where} and sumi.anio=${panio} and sumi.registro_dpto=${pregistro}`
            }


            //Control de paginación, si el parametro pagina tiene valor, significa que esta pidiendo datos por pagina
            if (ppagina || ppagina > 0){
                //Se necesita sacar el total de registros
                let query = `select count(*) "totalRegistros" 
                    from erco.vw_oficio_sumilla sumi
                    join erco.cr_departamentos_n dep on dep.id_departamento = sumi_id_dpto ${where}`
                    const result =  await getManager().query(query);    
                    totalRows = result[0].totalRegistros
                //si la pagina es 1, entonces no hace salto, de lo contrario, empieza a saltar los registros ya mostrados
                ppagina > 1 && (offset = (ppagina-1) * numeroPaginas)
                
                //Offset para completar el query
                qOffset = ` offset ${offset} rows fetch next ${numeroPaginas} rows only`
            }
            //Se une el query
            query = `${query} ${where} order by fecha_sumilla DESC ${qOffset}`
            const result = await getManager().query(query);
            const data = {data: result, totalRows, totalEnEspera}            
           return data;
        }catch(err){
            throw new Error(err);
        }
        // finally{
        //     getConnection().close();
        // }
    }

    async getSumillasByFiltro(pdireccionId: number, pfiltro: any, ppagina: number){
        try {
            let numeroPaginas = 20;
            let totalRows=0;
            let where = '';
            let qOffset = '';
            let offset =0;
            let query = `select id_registro "idRegistro", id_sec_registro "id", tip_oficio "tipoOficio", digitos "digitos", anio "anio", fecha_ingreso "fechaIngreso", 
            cabe_usuario_ingresa "usuarioIngresa", cabe_tipo_documento "tipoDocumento", tipo_registro "tipoRegistro",
            sumi.registro_dpto "registroDepartamento", id_usuario_origen "idUsuarioOrigen", usuario_origen "usuarioOrigen",
            dpto_origen "departamentoOrigen", id_usuario_destino "idUsuarioDestino", usuario_destino "usuarioDestino",
            dpto_destino "departamentoDestino", asunto "asunto", sumillado "sumillado", nro_documento "nroDocumento",
            sumi_id_usuario_destino "sumillaIdUsuarioDestino", sumi_usuario_destino "sumillaUsuarioDestino",
            sumi_dpto_destino "sumillaDepartamentoDestino", sumi_estado_usuarios "sumillaEstado", sumilla "sumilla", sumi.siglas "siglas",
            round(sysdate - fecha_sumilla) "diasEspera",
            fecha_sumilla "fechaSumilla"
            from erco.vw_oficio_sumilla sumi
            join erco.cr_departamentos_n dep on dep.id_departamento = sumi_id_dpto`
            where = `where sumillado = 'S'  
                     and dep.direccion_id = ${pdireccionId}`
                
                if (pfiltro?.fechaDesde){
                    if (pfiltro?.fechaHasta === null || pfiltro?.fechaHasta === undefined){
                        pfiltro.fechaHasta = moment();
                    }
                    let xf1 = moment(new Date(pfiltro.fechaDesde)).format('YYYY-MM-DD');
                    let xf2 = moment(new Date(pfiltro.fechaHasta)).format('YYYY-MM-DD');
                    pfiltro?.fechaDesde && (where = `${where} and sumi.fecha_sumilla between trunc(to_date('${xf1}', 'YYYY-MM-DD'))
                                            and trunc(to_date('${xf2}', 'YYYY-MM-DD')) `)
                }
                pfiltro?.asunto && (where = ` ${where} and sumi.asunto like '${pfiltro.asunto.toUpperCase()}'`);
                pfiltro?.oficio && (where = ` ${where} and sumi.nro_documento like '${pfiltro.oficio.toUpperCase()}'`);
                //Control de paginación, si el parametro pagina tiene valor, significa que esta pidiendo datos por pagina
                if (ppagina || ppagina > 0){
                    //Se necesita sacar el total de registros
                    let query = `select count(*) "totalRegistros" 
                        from erco.vw_oficio_sumilla sumi
                        join erco.cr_departamentos_n dep on dep.id_departamento = sumi_id_dpto ${where}`
                        const result = await getManager().query(query);    
                        totalRows = result[0].totalRegistros
                    //si la pagina es 1, entonces no hace salto, de lo contrario, empieza a saltar los registros ya mostrados
                    ppagina > 1 && (offset = (ppagina-1) * numeroPaginas)
                    
                    //Offset para completar el query
                    qOffset = ` offset ${offset} rows fetch next ${numeroPaginas} rows only`
                }

                query = `${query} ${where} order by fecha_sumilla DESC ${qOffset}`
                const result = await getManager().query(query);
                const data = {data: result, totalRows: totalRows}            
                return data;            
        } catch (error) {
            throw new Error(error);            
        }
    }

    async getOficiosByFiltro(panio:number, pregistro:number, pfiltro: any, ppagina: number){
        try {
            let numeroPaginas = 20;
            let totalRows=0;
            let qOffset = '';
            let offset =0;
            let order='';
            let query2 = '';
            let query = `select c.id_registro "id", fecha_ingreso "fechaIngreso", id_usuario "usuario", dpto "dpto", tip_doc "tipoDocumento", 
            c.registro_dpto "registroDpto", tip_oficio "tipoOficio", anio "anio", digitos "digitos",
            d.id_dpto_origen "idDptoOrigen",d.dpto_origen "dptoOrigen", d.id_usuario_origen "idUsuarioOrigen", d.usuario_origen "usuarioOrigen", 
            d.id_usuario_destino "idUsuarioDestino", d.usuario_destino "usuarioDestino", d.id_dpto_destino "idDptoDestino", 
            d.asunto "asunto", 
            (select count(*) from cr_registros_detalle s 
            where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null and s.tipo='S') "sumillas",
            (select count(*) from cr_registros_detalle s 
            where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null and estado_usuarios = 'C') "contestacion"                        
            from erco.cr_registros_cabecera c
            left join erco.cr_registros_detalle d on d.id_registro = c.id_registro and d.id_sec_registro2 is null and d.id_registro2 is null `

            let where = `where dpto = 11`            
            if (pregistro > 0 ){ 
                let wh1 = ''; 
                wh1 = ` c.registro_dpto = ${pregistro} and c.anio = ${panio} `
                // panio && (wh1 = `${wh1} and  `)
                // wh1 = ` (${wh1}) `
                // let wh2 = '';
                // wh2 = ` d.registro_dpto = ${pregistro}`
                // panio && (wh2 = `${wh2} and d.anio2 = ${panio} `)
                // wh2 = ` (${wh2}) `
                 //where = ` ${where} and (${wh1} or ${wh2}) `
                 where = ` ${where} and ${wh1} `

                 query2 = `union all 
                 select c.id_registro "id", fecha_ingreso "fechaIngreso", id_usuario "usuario", dpto "dpto", tip_doc "tipoDocumento", 
                             c.registro_dpto "registroDpto", tip_oficio "tipoOficio", anio "anio", digitos "digitos",
                             d.id_dpto_origen "idDptoOrigen",d.dpto_origen "dptoOrigen", d.id_usuario_origen "idUsuarioOrigen", d.usuario_origen "usuarioOrigen", 
                             d.id_usuario_destino "idUsuarioDestino", d.usuario_destino "usuarioDestino", d.id_dpto_destino "idDptoDestino", 
                             d.asunto "asunto", 
                             (select count(*) from cr_registros_detalle s 
                             where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null and s.tipo='S') "sumillas",
                             (select count(*) from cr_registros_detalle s 
                             where s.id_registro = c.id_registro and s.id_sec_registro2 is not null and s.id_registro2 is not null and estado_usuarios = 'C') "contestacion"                     
                 from erco.cr_registros_detalle b
                 join erco.cr_registros_cabecera c on c.id_registro = b.id_registro
                 left join erco.cr_registros_detalle d on d.id_registro = c.id_registro  and d.id_sec_registro2 is null and d.id_registro2 is null 
                 where b.registro_dpto = ${pregistro} and b.anio2 = ${panio}`

            }else{
                pfiltro?.remitente && (where = `${where} and d.usuario_origen like '${pfiltro.remitente.toUpperCase()}' `)
                if (pfiltro?.fechaDesde){
                    if (pfiltro?.fechaHasta === null || pfiltro?.fechaHasta === undefined){
                        pfiltro.fechaHasta = moment();
                    }
                    pfiltro?.fechaDesde && (where = `${where} and fecha_ingreso between trunc(to_date('${moment(new Date(pfiltro.fechaDesde)).format('YYYY-MM-DD')}', 'YYYY-MM-DD'))
                                            and trunc(to_date('${moment(new Date(pfiltro.fechaHasta)).format('YYYY-MM-DD')}', 'YYYY-MM-DD')) `)
                }
                pfiltro?.asunto && (where = ` ${where} and d.asunto like '${pfiltro.asunto.toUpperCase()}' `)
                pfiltro?.oficio && (where = ` ${where} and c.nro_documento like '${pfiltro.oficio.toUpperCase()}' `)
                order = `order by fecha_ingreso DESC, c.registro_dpto DESC `;
            }

            //Control de paginación, si el parametro pagina tiene valor, significa que esta pidiendo datos por pagina
            if (ppagina || ppagina > 0){
                //Se necesita sacar el total de registros
                let query = `select count(*) "totalRegistros" 
                from erco.cr_registros_cabecera c
                left join erco.cr_registros_detalle d on d.id_registro = c.id_registro and d.id_sec_registro2 is null and d.id_registro2 is null  ${where}`
                const result = await getManager().query(query);    
                totalRows = result[0].totalRegistros
                //si la pagina es 1, entonces no hace salto, de lo contrario, empieza a saltar los registros ya mostrados
                ppagina > 1 && (offset = (ppagina-1) * numeroPaginas)
                
                qOffset = ` offset ${offset} rows fetch next ${numeroPaginas} rows only`
            }
            query = `${query} ${where} ${query2} ${order} ${qOffset}`
            const result = await getManager().query(query);
            const data = {data: result, totalRows: totalRows}            

            return data;            
        } catch (error) {
            throw new Error(error);
        }
        // finally{
        //     getConnection().close();
        // }
    }

    async getOficio(pid: number){
        try {
            let query = `select c.id_registro "id", fecha_ingreso "fechaIngreso", id_usuario "usuario", dpto "dpto", tip_doc "tipoDocumento", 
                            c.registro_dpto "registroDpto", tip_oficio "tipoOficio", anio "anio", digitos "digitos",
                            d.id_sec_registro "idSecRegistro", d.id_dpto_origen "idDptoOrigen", d.dpto_origen "dptoOrigen",d.id_usuario_origen "idUsuarioOrigen", 
                            d.usuario_origen "usuarioOrigen", d.id_usuario_destino "idUsuarioDestino", d.usuario_destino "usuarioDestino", 
                            d.id_dpto_destino "idDptoDestino", d.asunto "asunto", s.id_sec_registro "sumiIdSecRegistro", s.tipo "sumillado", d.observacion "observacion",
                            s.id_usuario_destino "sumiIdUsuarioDestino", s.usuario_destino "sumiUsuarioDestino", s.dpto_destino "sumiDptoDestino",
                            s.estado_usuarios "sumiEstadoUsuarios", s.registro_dpto "sumiRegistroDpto", s.fecha_envio "fechaSumilla", s.fecha_contesta "sumiFechaContesta",
                            s.fecha_vencimiento "sumiFechaVencimiento", s.sumilla "sumilla", s.registro_dpto "registroContesta", s.contestacion "contestacion",
                            s.id_dpto_destino "sumiIdDpto", nvl(dep.siglas,'?') "siglas", round(sysdate - s.fecha_envio) "diasEspera", e.est_descripcion "estadoSumilla",
                            s.tip_oficio2 "oficioContesta", s.anio2 "anioContesta", s.digitos2 "digitosContesta"
                            from erco.cr_registros_cabecera c
                            left join erco.cr_registros_detalle d on d.id_registro = c.id_registro 
                            left outer join cr_registros_detalle s on s.id_registro = c.id_registro and
                            d.id_sec_registro = s.id_sec_registro2 and s.tipo = 'S'
                            left outer join cr_departamentos_n dep on s.id_dpto_destino = dep.id_departamento
                            left outer join cr_estado e on s.estado_usuarios = e.est_codigo
                            where 
                            c.id_registro = ${pid}
                            and d.id_sec_registro2 is null
                            and d.id_registro2 is null
                            order by fecha_ingreso DESC, c.registro_dpto DESC, s.id_sec_registro asc`
            const result = await getManager().query(query);     
            //Armando un solo objeto    
            let {sumiIdSecRegistro, sumillado, sumiIdUsuarioDestino, 
                   sumiUsuarioDestino, sumiDptoDestino,sumiEstadoUsuarios, 
                   sumiRegistroDpto,fechaSumilla, sumiFechaVencimiento, 
                   sumilla, registroContesta, contestacion, sumiIdDpto, 
                   ...objeto} = result[0];

            //Armando las sumillas como detalle del obejto                   
            let sumillas :any = []
            result.map( (x :any) => {
                if (x.sumiIdSecRegistro) {
                    const {id,fechaIngreso,usuario,dpto,tipoDocumento,registroDpto,tipoOficio,
                           anio, digitos, idSecRegistro, idDptoOrigen, dptoOrigen,idUsuarioOrigen,
                           usuarioOrigen,idUsuarioDestino, usuarioDestino,idDptoDestino,asunto,
                            ...nuevo} = x
                    sumillas.push(nuevo);
                }
            })

            let querygerCon=`select g.tip_oficio2 "gerTipoOficio", g.digitos2 "gerDigitos", g.anio2 "gerAnio", g.contestacion "gerContestacion", 
                             g.fecha_contesta "gerFechaContesta", g.id_sec_registro "gerIdSecRegistro"
                             from cr_registros_detalle g
                             where 
                                 g.id_registro = ${pid}
                             and g.id_sec_registro2 = ${result[0].idSecRegistro} and g.tipo = 'G'                           
                             and nvl(g.estado_usuarios,'A') != 'X'
                            `
            const gerContesta = await getManager().query(querygerCon);                                 
            objeto = {...objeto, sumillas, gerContesta};
            return objeto
        } catch (error) {
            throw new Error(error);
        }
        // finally{
        //     getConnection().close();
        // }
    }

    async getSumillasEnEspera(){
        try{
            let query = `select id_registro "idRegistro", id_sec_registro "id", tip_oficio "tipoOficio", digitos "digitos", anio "anio", fecha_ingreso "fechaIngreso", 
            cabe_usuario_ingresa "usuarioIngresa", cabe_tipo_documento "tipoDocumento", tipo_registro "tipoRegistro",
            registro_dpto "registroDepartamento", id_usuario_origen "idUsuarioOrigen", usuario_origen "usuarioOrigen",
            dpto_origen "departamentoOrigen", id_usuario_destino "usuarioDestino", usuario_destino "usuarioDestino",
            dpto_destino "departamentoDestino", asunto "asunto", sumillado "sumillado", 
            sumi_id_usuario_destino "sumillaIdUsuarioDestino", sumi_usuario_destino "sumillaUsuarioDestino",
            sumi_dpto_destino "sumillaDepartamentoDestino", sumi_estado_usuarios "sumillaEstado", sumilla "sumilla", siglas "siglas",
            round(sysdate - fecha_sumilla) "diasEspera",
            fecha_sumilla "fechaSumilla"
            from vw_oficio_sumilla
            where sumillado = 'S' and sumi_estado_usuarios = 'S' 
            order by fecha_sumilla DESC`
            const result = await getManager().query(query);
           return result;
        }catch(err){
            throw new Error(err);
        }
    }    

    async getDepartamentos(){
        try {
            let query = `select dc.id_departamento "corrIdDepartamento", d.descripcion "departamento", sigla "siglas", d.cargo "cargoId", p.nombre1||' '||p.apellido1 "empleado", p.usuario "usuario"
                            from cr_departamentos_n dc
                            join rhh_direccion d on d.codigo = dc.direccion_id
                            join rhh_personal p on p.cargo = d.cargo and p.estado = 'A'
                            where id_departamento is not null
                            order by sigla`
            const result = await getManager().query(query);
            return result
        } catch (error) {
            throw new Error(error);
        }
    }

    async getFiltroUsuarios(pbuscar :string){
        try {
            let query = `select tipo "tipo",  usuario "usuario", empleado "empleado", departamento  "departamento", id_departamento "departamentoId" , codigo "id"
                        from (
                        select 'I' tipo ,  usuario, empleado, departamento, d.id_departamento, codigo           
                        from vw_empleado e
                        left outer join  cr_departamentos_n d on d.direccion_id = e.direccion_id
                        where e.estado= 'A'
                        and e.usuario like '%${pbuscar}%'
                        or e.empleado like '%${pbuscar}%'
                        union all
                        select 'E' tipo, id_usuario, nombre_usuario, d.descripcion, d.id_departamento, usu_codigo
                        from cr_usuarios_departamentos u
                        join  cr_departamentos_n d on d.id_departamento = u.id_departamento
                        where 
                        id_usuario like '%${pbuscar}%' 
                        or nombre_usuario like '%${pbuscar}%'
                        )
                        fetch first 10 rows only`
            const result = await getManager().query(query);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getEstado(){
            return this.estadoRepo.find({where: [{estado: 'A'}]})            
    }

    async insertSumilla(precord:any){
        try {
            let qrySecuencia = `select cr_s_registro_detalle.nextval from dual`
            const resSecuencia = await getManager().query(qrySecuencia);
            let query = `insert into cr_registros_detalle (
                ID_REGISTRO, ID_SEC_REGISTRO, FECHA_ENVIO, ID_USUARIO_DESTINO, ID_DPTO_DESTINO, ESTADO_USUARIOS, USUARIO_DESTINO,
                DPTO_DESTINO, SUMILLA, ID_REGISTRO2, ID_SEC_REGISTRO2, TIPO ) values (
                    ${precord.idRegistro},${resSecuencia[0].NEXTVAL},
                    to_date('${moment().format('YYYY-MM-DD')}','yyyy-mm-dd'),
                    '${precord.sumiIdUsuarioDestino}',${precord.sumiIdDpto},
                    '${precord.sumiEstadoUsuarios}', '${precord.sumiUsuarioDestino}', 
                    '${precord.sumiDptoDestino}', '${precord.sumilla}', 
                    ${precord.idRegistro2}, ${precord.idSecRegistro2}, 
                    'S')`;
            const inserta = await getManager().query(query);
            return resSecuencia[0].NEXTVAL;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteSumilla(pid : number){
        try {
            let query = `delete cr_registros_detalle where id_sec_registro = ${pid} and tipo='S'`
            const borrar = await getManager().query(query);
            return 'ok';
        } catch (error) {
            throw new Error(error);            
        }
    }

    async updateSumilla(precord: any){
        try {
            let query = `update cr_registros_detalle set sumilla='${precord.sumilla}', estado_usuarios='${precord.sumiEstadoUsuarios}' where id_sec_registro = ${precord.sumiIdSecRegistro} and tipo='S'`
            console.log('qry', query);
            const borrar = await getManager().query(query);
            return 'ok';
        } catch (error) {
            throw new Error(error);            
        }
    }




}
