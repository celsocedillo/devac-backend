import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { EaftaEntregaRecepcionDetalle } from "./EaftaEntregaRecepcionDetalle";
import { Empleado } from '../../seguridad/entities/empleado.entity'



@Index("EAFCN_ENTREC_PK", ["actaId", "actaAnio"], { unique: true })
@Entity("EAFTA_ENTREGA_RECEPCION")
export class EaftaEntregaRecepcion {

  @PrimaryGeneratedColumn({
      type: "number",
      name: "ACTA_ID"
  })
  actaId: number;
      
  @PrimaryGeneratedColumn({
    type: "number",
    name: "ACTA_ANIO"
  })
  actaAnio: number | null;

  @Column("date", { name: "FECHA_ACTA" })
  fechaActa: Date | null;

  @Column("varchar2", { name: "OBSERVACION", nullable: true, length: 500 })
  observacion: string | null;

  @Column("number", {
    name: "EMPLEADO_ENTREGA",
    precision: 6,
    scale: 0,
  })
  empleadoEntregaId: number | null;

  @Column("number", {
    name: "EMPLEADO_RECEPTA",
    precision: 6,
    scale: 0,
  })
  empleadoReceptaId: number | null;

  @Column("varchar2", { name: "USUARIO_INGRESA", length: 25 })
  usuarioIngresa: string | null;

  @Column("varchar2", { name: "USUARIO_APRUEBA", nullable: true, length: 25 })
  usuarioAprueba: string | null;

  @Column("date", { name: "FECHA_INGRESA" })
  fechaIngresa: Date | null;

  @Column("date", { name: "FECHA_APRUEBA", nullable: true })
  fechaAprueba: Date | null;

  @Column("varchar2", { name: "ESTADO", length: 2 })
  estado: string | null;
  
  @Column("varchar2", { name: "TIPO", length: 2 })
  tipo: string | null;

  @Column("number", {
    name: "DIRECCION_ID",
    precision: 4,
    scale: 0,
  })
  direccionId: number | null;

  @OneToMany(
    () => EaftaEntregaRecepcionDetalle,
    (eaftaEntregaRecepcionDetalle) => eaftaEntregaRecepcionDetalle.acta
  )
  detalle: EaftaEntregaRecepcionDetalle[];

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasInicial)
//   @JoinColumn([{ name: "ESTADO_INICIAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionInicial: EaftaEstadoSituacion;

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasFinal)
//   @JoinColumn([{ name: "ESTADO_FINAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionFinal: EaftaEstadoSituacion;


}

