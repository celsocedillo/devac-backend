import { Controller, Get, Param, Query, Post, Put, Body, Delete, ParseBoolPipe, ParseIntPipe, Res, Inject } from '@nestjs/common';
import { Response } from 'express';
import { GestionCustodioService } from '../services/gestionCustodio.service' 
import { CreateSolicituCambioCustodioDto, 
         UpdateSolicituCambioCustodioDto, 
         CreateDetalleSolicitudCambioCustodioDto,
        UpdateDetalleSolicitudCambioCustodioDto } from '../dtos/solicitudCambioCustodio.dto'
import { execSync } from 'child_process';
import fs from 'fs';
//import config from '../../../config.json';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from '../../../config';
@Controller('gestionCustodio')
export class GestionCustodioController {
    constructor(private gestionCustodioService: GestionCustodioService,
                @Inject(config.KEY) private configService: ConfigType<typeof config>){}

    //const ruta       

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

    @Put('areaDetalleSolicitudCambioEstado/:actadetId/:actaAnio/:actaId/:areaId/:todos')    
    areaDetalleSolicitudCambioEstado(@Param('actadetId', ParseIntPipe) actadetId: number,
                                       @Param('actaAnio') actaAnio: number,
                                       @Param('actaId') actaId: number,  
                                       @Param('areaId') areaId: number,
                                       @Param('todos', ParseBoolPipe) todos: boolean,){
        console.log('controller', todos);
        console.log('controller', typeof todos);
        return this.gestionCustodioService.areaDetalleSolicitudCambioEstado(actadetId, actaAnio, actaId, areaId, todos);
    }


    @Delete('deleteDetalleSolicitudCambioEstado/:id')    
    deleteDetalleSolicitudCambioEstado(@Param('id') id: number,){
        return this.gestionCustodioService.deleteDetalleSolicitudCambioEstado(id);
    }

    @Get('/actas/administrativo/:usuario')
    getListaActasCambioCustodioByAdministrativo(@Param('usuario') usuario: string,
                                                @Query('filtro') filtro: any){
        return this.gestionCustodioService.getListaSolicitudCambioCustdioByAdministrador(usuario, JSON.parse(filtro));
    }

    @Get('/actas/aprueba/:actaAnio/:actaId/:usuarioAprueba')
    apruebaActasCambioCustodioByAdministrativo(@Param('actaAnio') actaAnio: number,
                                               @Param('actaId') actaId: number,
                                               @Param('usuarioAprueba') usuarioAprueba: string){
        return this.gestionCustodioService.apruebaSolicitudCambioCustodio(actaAnio, actaId, usuarioAprueba);
    }

    @Get('areas/:direccionId')
    getAreas(@Param('direccionId') direccionId: number){
        return this.gestionCustodioService.getAreas(direccionId);
    }
    
    @Get('actaPdf/:actaId/:actaAnio')
    async getActaPdf(@Param('actaId') actaId: number,
               @Param('actaAnio') actaAnio: number,
               @Res() res: Response){

        const archivo=`solicitudCambio${actaAnio}${actaId}`;
        const archivoPdf = new Date().getTime();
        console.log('archivo -->' + archivoPdf);
        let parametros = { actaId, actaAnio};
        console.log('parametros --> ' + JSON.stringify(parametros));
        execSync(`generadorJava.bat solicitudCambio ${archivo} "${JSON.stringify(parametros)}"`)
        const src = fs.readFileSync(`${this.configService.rutaReportes}\\${archivo}.pdf`);
        res.setHeader(
            "Content-Type",
            "application/pdf"
          );
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=archivo.pdf`
          );
          return res.status(200).send();
    }
}

