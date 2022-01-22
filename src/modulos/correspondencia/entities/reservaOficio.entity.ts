import { Column, Entity, Index, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { TipoOficio } from './tipoOficio.entity'
import { VwDireccionNomina } from '../../generales/entities/vwDireccionNomina.entity';

@Entity("CO_NUMERO_OFICIO")

export class ReservaOficio {

  @PrimaryColumn({
    type: "number",
    name: "TOF_CODIGO"
    })
    tipoOficioId: number;

  @PrimaryColumn({
    type: "number",
    name: "NRO_OFICIO"
    })
    numeroOficio: number;

  @PrimaryColumn({
    type: "number",
    name: "ANIO"
    })
    anio: number;

    @Column("number", {
      name: "DESTINATARIO",
      nullable: true,
      precision: 4,
      scale: 0,
    })
    destinatarioId: number | null;

    @Column("varchar2", { name: "COPIA", nullable: true, length: 200 })
    copia: string | null;


    @Column("varchar2", { name: "ASUNTO", nullable: true, length: 1000 })
    asunto: string | null;

    @Column("date", { name: "FECHA_IMPRESION", nullable: true })
    fechaImpresion: Date | null;

    @Column("number", {
      name: "DIRECCION_ID",
      nullable: true,
      precision: 5,
      scale: 0,
    })
    direccionId: number | null;

    @Column("varchar2", { name: "USUARIO", nullable: true, length: 15 })
    usuario: string | null;

    @Column("date", { name: "FECHA_INGRESO", nullable: true })
    fechaIngreso: Date | null;

    @Column("varchar2", { name: "ESTADO", nullable: true, length: 2 })
    estado: string | null;

    @Column("date", { name: "FECHA_ESTADO", nullable: true })
    fechaEstado: Date | null;

    @Column("varchar2", { name: "OBSERVACION", nullable: true, length: 2000 })
    observacion: string | null;

    @Column("varchar2", { name: "DESC_DESTINATARIO", nullable: true, length: 100 })
    referenciaDestinatario: string | null;

    @Column("varchar2", { name: "RESPUESTA", nullable: true, length: 3 })
    respuesta: string | null;

    @ManyToOne(()=> TipoOficio, (tipoOficio)=> tipoOficio.reservasOficio)
    @JoinColumn({name: 'TOF_CODIGO'})
    tipoOficio: TipoOficio

    @ManyToOne(()=> VwDireccionNomina, (direccionNomina)=> direccionNomina.reservasOficio)
    @JoinColumn({name: 'DIRECCION_ID'})
    direccionNomina: VwDireccionNomina

    
}
