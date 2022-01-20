import {  Entity, PrimaryColumn, Column } from "typeorm";

@Entity("CO_PARAMETRO")

export class ReservaSecuencia {

  @PrimaryColumn({
    type: "number",
    name: "TOF_CODIGO"
    })
    tipoOficioId: number;

  @Column({
    type: "number",
    name: "NRO_OFICIO"
    })
    numeroOficio: number;

  @PrimaryColumn({
    type: "number",
    name: "ANIO"
    })
    anio: number;


}