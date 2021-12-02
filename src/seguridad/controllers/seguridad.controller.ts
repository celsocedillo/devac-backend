import { Controller, Post, Req, NotFoundException, UseGuards, SetMetadata, Get, Param } from '@nestjs/common';
import { Request } from 'express'
import { SeguridadService } from '../services/seguridad.service'
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

import { Empleado } from '../entities/empleado.entity';

//@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@Controller('seguridad')
export class SeguridadController {
    constructor(private seguridadService: SeguridadService){}


    @SetMetadata('isPublic', true)
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req: Request) {
        try {
            console.log('login');
            const {username, password} = req.body;
            const empleado = await this.seguridadService.getEmpleado(username);
            const token = this.seguridadService.generateJWT(username, empleado.codigo);
            return ({empleado, token});
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    @Get('infoUsuario/:usuario')
    async getEmpleado(@Param('usuario') usuario: string){
        return this.seguridadService.getEmpleado(usuario);
    }
}
