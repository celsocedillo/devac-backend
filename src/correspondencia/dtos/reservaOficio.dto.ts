import {IsNumber, IsString, IsNotEmpty, IsDate} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';

export class CreateReservaOficioDto{
    
    @IsNumber()
    @IsNotEmpty()
    readonly tipoOficioId: number;
    
    @IsNumber()
    @IsNotEmpty()
    readonly anio: number;

    @IsNumber()
    readonly destinatarioId: number | null;

    @IsString()
    @IsNotEmpty()
    readonly asunto: string | null;

    @IsString()
    readonly copia: string | null;
    
    @IsNumber()
    readonly direccionId: number | null;

    @IsString()
    @IsNotEmpty()
    readonly usuario: string | null;
    
    @IsString()
    @IsNotEmpty()
    readonly estado: string | null;
  
    @IsString()    
    readonly observacion: string | null;
    
    @IsString()
    readonly referenciaDestinatario: string | null;

    @IsString()
    @IsNotEmpty()
    readonly respuesta: string | null;
    
}

export class UpdateReservaOficioDto extends PartialType(CreateReservaOficioDto) {}