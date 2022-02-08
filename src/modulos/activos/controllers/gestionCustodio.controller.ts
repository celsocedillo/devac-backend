import { Controller, Get, Param } from '@nestjs/common';
import { GestionCustodioService } from '../services/gestionCustodio.service' 

@Controller('gestionCustodio')
export class GestionCustodioController {
    constructor(private gestionCustodioService: GestionCustodioService){}

    @Get('actas')
    getActas(){
        return this.gestionCustodioService.getActas();
    }

    @Get('acta/:id')
    getActa(@Param('id') id: number){
        return this.gestionCustodioService.getActa(id);
    }

    @Get('activosCustodio/:custodioId')
    getActivosCustodio(@Param('custodioId') custodioId: number){
        return this.gestionCustodioService.getActivosByCustodio(custodioId);
    }
}