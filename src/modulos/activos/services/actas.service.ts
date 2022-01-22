import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from "moment";
import { Repository, getManager } from 'typeorm';
import { EaftaActa } from '../entities/EaftaActa'
import { EaftaActaDetalle } from '../entities/EaftaActaDetalle'
import { EaftaEstadoSituacion } from '../entities/EaftaEstadoSituacion';


@Injectable()
export class ActasService {
    constructor (@InjectRepository(EaftaActa) private actaRepository: Repository<EaftaActa>,
                 @InjectRepository(EaftaActaDetalle) private actaDetalleRepository: Repository<EaftaActaDetalle>,
                 @InjectRepository(EaftaEstadoSituacion) private estadoSituacionRepository: Repository<EaftaEstadoSituacion>
                ){
    }

    async getActas() {
        return await this.actaRepository
        .createQueryBuilder("acta")
        .select(["acta", "estadoSituacionInicial.descripcion", "estadoSituacionFinal.descripcion"])
        .leftJoin("acta.estadoSituacionInicial", "estadoSituacionInicial")
        .leftJoin("acta.estadoSituacionFinal", "estadoSituacionFinal")
        .getMany();
    }

}
