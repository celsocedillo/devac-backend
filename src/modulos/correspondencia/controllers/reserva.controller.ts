import { Controller, Get, Param, Query, UseGuards, HttpCode, HttpStatus, Post, Body, Put, Delete, Header, Res} from '@nestjs/common';
import { ReservaService} from '../services/reserva.service';
import { CreateReservaOficioDto, UpdateReservaOficioDto } from '../dtos/reservaOficio.dto';

@Controller('reserva')
export class ReservaController {
    constructor (private reservaService: ReservaService){}

    @Get('oficios/:tipoOficioId/:direccionId/:anio')
    getReservas(@Param('tipoOficioId') tipoOficioId: number,
                @Param('direccionId') direccionId: number,
                @Param('anio') anio: number,
                @Query() params: any){
        return this.reservaService.getReservas(tipoOficioId, direccionId, anio, params);
    }

    @Get(':direccionId/')
    getReservasByDepartamento(
            @Param('direccionId') direccionId: number,
            @Query() params: any){
        console.log('contrpara', params);
        return this.reservaService.getReservasByDireccion(direccionId, params);
    }

    @Get('tipoOficio/ByDireccion/:direccionId')
    getTipoOficioByDireccion(
        @Param('direccionId') direccionId: number,
        @Param('estado') estado: string,
    ){
        return this.reservaService.getTipoOFicioByDireccion(direccionId);
    }

    @Get('tipoOficio/ByDireccion/activos/:direccionId')
    getTipoOficioByDireccionActivos(
        @Param('direccionId') direccionId: number
    ){
        return this.reservaService.getTipoOFicioByDireccionActivos(direccionId);
    }

    @Get('reservaByNumero/:tipoOficioId/:anio/:numeroOficio')
    getReservaByNumero(@Param('tipoOficioId') tipoOficio: number,
                       @Param('anio') anio: number,
                       @Param('numeroOficio') numeroOficio: number,
    ){
        return this.reservaService.getReservaByNumero(tipoOficio, anio, numeroOficio);
    }

    @Post('createReserva')    
    createReservaOficio(@Body() payload: CreateReservaOficioDto){
        return this.reservaService.createReservaOficio(payload);
    }

    @Put('updateReserva/:numeroOficio')
    updateReservaOficio(@Param('numeroOficio') numeroOficio: number, @Body() payload: UpdateReservaOficioDto){
        return this.reservaService.updateReservaOficio(numeroOficio, payload);
    }
   

}
