import { Controller, Get, Param, Query, UseGuards, HttpCode, HttpStatus, Post, Body, Put, Delete, Header, Res} from '@nestjs/common';
import { CorrespondenciaService } from '../services/correspondencia.service'
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Workbook, Worksheet } from 'exceljs';

@UseGuards(AuthGuard('jwt'))
@Controller('correspondencia')
export class CorrespondenciaController {
    constructor (private correspondenciaService: CorrespondenciaService){}

    @Get('oficiosSumillaDireccion/:direccionId/:estado/:pagina/:anio/:registro')
    getSumillasDireccion(@Param('direccionId') direccionId: number,
                         @Param('estado') estado: string,
                         @Param('pagina') pagina: number,
                         @Param('anio') anio: number,
                         @Param('registro') registro: number){
        return this.correspondenciaService.getSumillasDireccion(direccionId, estado, pagina, anio, registro);
    }

    @Get('oficiosSumillaByFiltro/:direccionId/:pagina')
    getOficiosSumillaByFiltro(@Param('direccionId') direccionId: number,
                              @Param('pagina') pagina: number,
                              @Query() params: any){
        return this.correspondenciaService.getSumillasByFiltro(direccionId, params, pagina);
    }


    @Get('oficiosByFiltro/:anio/:registro/:pagina')
    getOficiosByFiltro(@Param('anio') anio: number,
                       @Param('registro') registro: number,
                       @Param('pagina') pagina: number,
                       @Query() params: any){
        return this.correspondenciaService.getOficiosByFiltro(anio, registro, params, pagina);
    }


    @Get('oficio/:id')
    getOficio(@Param('id') id: number){
        return this.correspondenciaService.getOficio(id);
    }

    @Get('oficiosEnEspera')
    getSumillasEnEspera(){
        return this.correspondenciaService.getSumillasEnEspera();   
    }

    @Get('departamentos')
    getDepartamentos(){
        return this.correspondenciaService.getDepartamentos();
    }

    @Get('filtroUsuarios/:buscar')
    getFiltroUsuarios(@Param('buscar') buscar: string){
        return this.correspondenciaService.getFiltroUsuarios(buscar);
    }

    @Get('estadoUsuarios')
    getEstadoUsuarios(){
        return this.correspondenciaService.getEstado();
    }

    @Post('sumilla')
    insertSumilla(@Body() payload: any){
        return this.correspondenciaService.insertSumilla(payload);
    }

    @Put('sumilla')
    updateSumilla(@Body() payload: any){
        return this.correspondenciaService.updateSumilla(payload);
    }

    @Delete('sumilla/:id')
    deleteSumilla(@Param('id') id:number){
        return this.correspondenciaService.deleteSumilla(id);
    }

    @Get('filtroUsuarios/:buscar')
    getUsuarios(@Param('buscar') buscar:string){
        return this.correspondenciaService.getFiltroUsuarios(buscar);
    }

    @Get('oficiosEnEsperaExcel')
    async getOficiosEnEsperaExcel(@Res() res: Response){
        const resultado= await this.correspondenciaService.getSumillasEnEspera();
        let libro = new Workbook();
        let hoja = libro.addWorksheet('SumillasEnEspera');
        if (resultado.length > 0){
            const datos = resultado;
            hoja.getRow(3).values = ["anio", "tipoOficio", "digitos", "fechaIngreso", "registroDepartamento", "usuarioOrigen", 
                                     "departamentoOrigen", "asunto", "fechaSumilla", "sumillaIdUsuarioDestino", "sumillaDepartamentoDestino", 
                                     "siglas", "sumilla", "diasEspera"]
            hoja.columns = [
                {key: "anio", width: 12},
                {key: "tipoOficio", width: 20},
                {key: "digitos", width: 15},
                {key: "fechaIngreso", width: 20},
                {key: "registroDepartamento", width: 20},
                {key: "usuarioOrigen", width: 30},
                {key: "departamentoOrigen", width: 40},
                {key: "asunto", width: 50},
                {key: "fechaSumilla", width: 20},
                {key: "sumillaIdUsuarioDestino", width: 30},
                {key: "sumillaDepartamentoDestino", width: 40},
                {key: "siglas", width: 15},
                {key: "sumilla", width: 50},
                {key: "diasEspera", width: 20},
                ]
            for (let i = 0; i < datos.length; i++){
                hoja.addRow({
                    anio: datos[i].anio,
                    tipoOficio: datos[i].tipoOficio,
                    digitos: datos[i].digitos,
                    fechaIngreso: datos[i].fechaIngreso,
                    registroDepartamento: datos[i].registroDepartamento,
                    usuarioOrigen: datos[i].usuarioOrigen,
                    departamentoOrigen: datos[i].departamentoOrigen,
                    asunto: datos[i].asunto,
                    fechaSumilla: datos[i].fechaSumilla,
                    sumillaIdUsuarioDestino: datos[i].sumillaIdUsuarioDestino,
                    sumillaDepartamentoDestino: datos[i].sumillaDepartamentoDestino,
                    siglas: datos[i].siglas,
                    sumilla: datos[i].sumilla,
                    diasEspera: datos[i].diasEspera,
                })
            }
        }
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "SumillasEspera.xlsx"
          );
        const fil =   await libro.xlsx.write(res);
        return res.status(200).send();
    }

    @Get('oficiosSumillaByFiltroExcel/:direccionId/:pagina')
    async getSumillasByFiltroExcel(@Param('direccionId') direccionId: number,
                                   @Param('pagina') pagina:number,
                                   @Query() params: any,
                                   @Res() res:Response){
            const resultado = await this.correspondenciaService.getSumillasByFiltro(direccionId, params, 0);
            let libro = new Workbook();
            let hoja = libro.addWorksheet('Sumillas');
            if (resultado.data.length > 0){
                const datos = resultado.data;
                hoja.getRow(3).values = ["fechaRegistro", "registro", "usuarioOrigen", "nroDocumento", "asunto", "fechaSumilla", "estadoSumilla", "sumillaUsuarioDestino", "sumilla"]
                hoja.columns = [
                    {key: "fechaRegistro", width: 12},
                    {key: "registro", width: 10},
                    {key: "usuarioOrigen", width: 25},
                    {key: "nroDocumento", width: 30},
                    {key: "asunto", width: 60},
                    {key: "fechaSumilla", width: 12},
                    {key: "estadoSumilla", width: 25},
                    {key: "sumillaUsuarioDestino", width: 25},
                    {key: "sumilla", width: 60},
                    ]
                for (let i = 0; i < datos.length; i++){
                    hoja.addRow({
                        fechaRegistro: datos[i].fechaIngreso,
                        registro: datos[i].registroDepartamento,
                        usuarioOrigen: datos[i].usuarioOrigen,
                        nroDocumento: datos[i].nroDocumento,
                        asunto: datos[i].asunto,
                        fechaSumilla: datos[i].fechaSumilla,
                        estadoSumilla: datos[i].sumillaEstado === "E" ? 'En espera' : datos[i].sumillaEstado === "C" ? 'Contestado' : 'Informado',
                        sumillaUsuarioDestino: datos[i].sumillaUsuarioDestino,
                        sumilla: datos[i].sumilla,
                    })
                }
            }
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "listadoSumillas.xlsx"
                );
                await libro.xlsx.write(res);
            return res.status(200).send();
    }
    
}
 