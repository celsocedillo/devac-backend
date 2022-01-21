import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import  oracledb from 'oracledb';
import { getConnection } from 'oracledb'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import config from '../../config';
import {Empleado} from '../entities/empleado.entity'


@Injectable()
export class SeguridadService {

    constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>, private jwtService: JwtService,
    @InjectRepository(Empleado) private empleadoRepo: Repository<Empleado>){
        
    }

    async validateUser(username: string, password: string){
        //Realizando conneccion de usuario
        try {
            let conn = await getConnection({connectString: `${this.configService.oracle.host}:${this.configService.oracle.port}/${this.configService.oracle.sid}`, 
                                            user: username, 
                                            password:password});
            //const empleado = await this.empleadoRepo.findOne({where:[{usuario: username}] })
            return username;
        } catch (error) {
            if (error.errorNum === 1017){
                throw new NotFoundException("Usuario/Password incorrecto", )
            }
            else{
                throw new NotFoundException(error)
            }
        }
    }

    async getEmpleado(username: string){
        let datos;
        const empleado = await this.empleadoRepo.findOne({where:[{usuario: username}] })
        datos = empleado;
            //Buscar si el usuario esta activado en secretaría
            let query2 = `select id_usuario from cr_usuarios_departamentos where id_usuario = '${username}' and id_departamento = 11 and estado='A'` 
            const data2 = await getManager().query(query2);
            if (data2 && data2.length > 0){
                datos = {...empleado, usuarioSecretaria: true};
            }
            return datos; 
        return empleado;
    }

    generateJWT(user: string, id: number){
        const payload = {role: user, sub: id}
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }

    async getOpcionesByUsuario(user: string){
        const manager = getManager();
        const query = `select max(view_id) "id", menu_id "menuId",max(tipo) "tipo", max(forma) "forma", 
                        max(label_menu) "labelMenu", max(orden_query) "ordenQuery", max(padre_id) "padreId"
                        from erco.esgvw_opcion_usuario 
                        where usuario = '${user}' 
                        and aplicacion_id = 'Devac'
                        and habilitar_opcion = 'S'
                        group by menu_id
                        order by "ordenQuery"`
        const result = await manager.query(query);
        return result
    }


    async getModulosByUsuario(user: string){
        const manager = getManager();
        const query = `select max(view_id) "id", menu_id "menuId",max(tipo) "tipo", max(forma) "forma", 
                        max(label_menu) "labelMenu", max(orden_query) "ordenQuery", max(padre_id) "padreId"
                        from erco.esgvw_opcion_usuario 
                        where usuario = '${user}' 
                        and aplicacion_id = 'Devac'
                        and tipo = 'M'
                        and habilitar_opcion = 'S'
                        group by menu_id
                        order by "ordenQuery"`
        const result = await manager.query(query);
        return result
    }



}
