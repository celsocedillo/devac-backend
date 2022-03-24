import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';

import { Tipos } from '../entities/tipo.entity';
import { VwEmpleado } from '../entities/vwEmpleado.entity'

@Injectable()
export class GeneralesService {
    constructor(@InjectRepository(Tipos) private tiposRepo: Repository<Tipos>,
                @InjectRepository(VwEmpleado) private vwEmpleadoRepo: Repository<VwEmpleado>) {

    }

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

    async getEmpleadosByFiltro(pfiltro : string){
        return await this.vwEmpleadoRepo.createQueryBuilder('empleados')
        .select(['empleados'])
        .where("empleados.empleado like :filtro", {filtro: `%${pfiltro.toUpperCase()}%`})
        .take(10)
        .getMany()
    }

    async updateTipo(changes: any){
        const tipo = await this
        .tiposRepo.findOne(changes.id);
        this.tiposRepo.merge(tipo, changes);
        return this.tiposRepo.save(tipo);
    }


}
