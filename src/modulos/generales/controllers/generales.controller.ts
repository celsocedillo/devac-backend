import { Controller, Get, Param, Post, Body, Put, UseGuards } from '@nestjs/common';
import { GeneralesService } from '../services/generales.service'
//import {} from '../../seguridad/'
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('generales')
export class GeneralesController {
    constructor(private generalesService: GeneralesService) {}
    @Get('tipos')
    findTiposGeneral() {
      return this.generalesService.findTiposGeneralAll()
    }

    @Get('tipos/:tipoId')
    findTipoByTipo(@Param('tipoId') tipoId: number){
      return this.generalesService.findTipoByTipo(tipoId);
    }

    @Post('tipo')
    createTipo(@Body() payload: any){
      return this.generalesService.createTipo(payload);
    }

    @Put("tipo")
    updateTipo(@Body() payload: any){
      return this.generalesService.updateTipo(payload);
    }
  
}
