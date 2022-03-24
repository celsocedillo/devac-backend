import {IsNumber, IsString, IsNotEmpty, IsDate} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';

export class CreateSolicituCambioCustodioDto{

    
    @IsNumber()
    @IsNotEmpty()
    readonly empleadoEntregaId: number;
    
    @IsNumber()
    @IsNotEmpty()
    readonly empleadoReceptaId: number;

    @IsString()
    readonly observacion: string | null;

    @IsString()
    @IsNotEmpty()
    readonly usuarioIngresa: string | null;

    @IsString()
    @IsNotEmpty()
    readonly estado: string | null;

    readonly detalle: CreateDetalleSolicitudCambioCustodioDto[]
    
}

export class UpdateSolicituCambioCustodioDto extends PartialType(CreateSolicituCambioCustodioDto) {
    
    @IsNumber()
    @IsNotEmpty()
    readonly actaId: number;

    @IsNumber()
    @IsNotEmpty()
    readonly actaAnio: number;

    @IsString()
    readonly usuarioAprueba: string | null;

}


export class CreateDetalleSolicitudCambioCustodioDto{
    @IsNumber()
    @IsNotEmpty()
    readonly actaId: number;

    @IsNumber()
    @IsNotEmpty()
    readonly actaAnio: number;

    @IsNumber()
    @IsNotEmpty()
    readonly activoId: number;
}

export class UpdateDetalleSolicitudCambioCustodioDto extends PartialType(CreateDetalleSolicitudCambioCustodioDto){
    @IsNumber()
    @IsNotEmpty()
    readonly actadetId: number;

}
