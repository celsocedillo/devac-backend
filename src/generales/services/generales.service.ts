import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';

import { Tipos } from '../entities/tipo.entity';

@Injectable()
export class GeneralesService {
    constructor(@InjectRepository(Tipos) private tiposRepo: Repository<Tipos>) {}

    async findTiposGeneralAll() {
        const manager = getManager();
        const query = `select tipo_id, descripcion from ge_tipos`
        const result = await manager.query(query);
        console.log('xxxx', result);
        return this.tiposRepo.find({
            where: [{tipoId: null}]
        });
      }

    findTipoByTipo(tipoId: number){
        return this.tiposRepo.find({
            where: [{tipoId: tipoId}]
        })
    }

    createTipo(data: any){
        const newRecord = this.tiposRepo.create(data);
        return this.tiposRepo.save(newRecord);
    }

    async updateTipo(changes: any){
        const tipo = await this
        .tiposRepo.findOne(changes.id);
        this.tiposRepo.merge(tipo, changes);
        return this.tiposRepo.save(tipo);
    }


}
