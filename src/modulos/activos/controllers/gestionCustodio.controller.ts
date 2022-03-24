import { Controller, Get, Param, Query, Post, Put, Body, Delete } from '@nestjs/common';
import { GestionCustodioService } from '../services/gestionCustodio.service' 
import { CreateSolicituCambioCustodioDto, 
         UpdateSolicituCambioCustodioDto, 
         CreateDetalleSolicitudCambioCustodioDto } from '../dtos/solicitudCambioCustodio.dto'

@Controller('gestionCustodio')
export class GestionCustodioController {
    constructor(private gestionCustodioService: GestionCustodioService){}

    @Get('actas')
    getActas(){
        return this.gestionCustodioService.getActas();
    }

    @Get('acta/:anio/:id')
    getActa(@Param('id') id: number,
            @Param('anio') anio: number){
        return this.gestionCustodioService.getActa(anio, id);
    }

    @Get('activosUsuario/:custodioId')
    getActivosCustodio(@Param('custodioId') custodioId: number){
        return this.gestionCustodioService.getActivosByCustodio(custodioId);
    }

    @Get('actas/usuario/:custodioId')
    getActasUsuario(@Param('custodioId') custodioId: number,
                    @Query('paginacion') paginacion: any){
        return this.gestionCustodioService.getActasUsuario(custodioId, JSON.parse(paginacion))
    }

    
    @Post('createSolicitudCambioEstado')    
    createSolicitudCambioEstado(@Body() payload: CreateSolicituCambioCustodioDto){
        return this.gestionCustodioService.createSolicitudCambioEstado(payload);
    }

    @Put('updateSolicitudCambioEstado')    
    updateSolicitudCambioEstado(@Body() payload: UpdateSolicituCambioCustodioDto){
        return this.gestionCustodioService.updateSolicitudCambioEstado(payload);
    }

    @Post('createDetalleSolicitudCambioEstado')    
    createDetalleSolicitudCambioEstado(@Body() payload: CreateDetalleSolicitudCambioCustodioDto){
        return this.gestionCustodioService.createDetalleSolicitudCambioEstado(payload)
    }

    @Delete('deleteDetalleSolicitudCambioEstado/:id')    
    deleteDetalleSolicitudCambioEstado(@Param('id') id: number,){
        return this.gestionCustodioService.deleteDetalleSolicitudCambioEstado(id);
    }


    
}

