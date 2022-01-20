import {IsNumber, IsString, IsNotEmpty, IsDate,} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';

export class CreateSecuenciaOficioDto{
    
    @IsNumber()
    @IsNotEmpty()
    readonly tipoOficioId: number;
    
    @IsNumber()
    @IsNotEmpty()
    readonly anio: number;

    @IsNumber()
    readonly numeroOficio: number | null;

   
}


export class UpdateSecuenciaOficioDto extends PartialType(CreateSecuenciaOficioDto) {}