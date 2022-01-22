import { Controller, Get } from '@nestjs/common';
import { ActasService } from '../services/actas.service'

@Controller('activos')
export class ActivosController {
    constructor(private actasService: ActasService){}

    @Get('actas')
    getActas(){
        return this.actasService.getActas();
    }
}