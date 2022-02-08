import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { EaftaEntregaRecepcion } from "./EaftaEntregaRecepcion";
import { VwActivoGeneral } from './VwActivoGeneral'
import { EaftaArea } from './EaftaArea'


@Index("EAFCN_ENTRECDET_PK", ["actadetId"], { unique: true })
@Entity("EAFTA_ENTREGA_RECEPCION_DET")
export class EaftaEntregaRecepcionDetalle {

  @PrimaryGeneratedColumn({
      type: "number",
      name: "ACTADET_ID"
  })
  actadetId: number;

  @Column("number", {
    name: "ACTA_ID",
    precision: 10,
    scale: 0,
  })
  actaId: number | null;

  @Column("number", {
    name: "ACTA_ANIO",
    nullable: true,
    precision: 4,
    scale: 0,
  })
  actaAnio: number | null;

  @Column("number", {
    name: "ACTIVO_ID",
    precision: 6,
    scale: 0,
  })
  activoId: number | null;

  @Column("varchar2", { name: "ESTADO", length: 2 })
  estado: string | null;

  @Column("varchar2", { name: "ESTADO_ACTIVO", length: 2, nullable: true })
  estadoActivo: string | null;

  @Column("number", {
    name: "ID_AREA",
    precision: 3,
    scale: 0,
    nullable: true
  })
  areaId: number | null;

  @ManyToOne(() => EaftaEntregaRecepcion, (eaftaEntregaRecepcion) => eaftaEntregaRecepcion.detalle)
  @JoinColumn([{ name: "ACTA_ID", referencedColumnName: "actaId" }])
  acta: EaftaEntregaRecepcion;

  @ManyToOne(() => VwActivoGeneral, (vwActivoGeneral) => vwActivoGeneral.entregaRecepcionDetalle)
  @JoinColumn([{ name: "ACTIVO_ID", referencedColumnName: "activoId" }])
  activo: VwActivoGeneral;

  @ManyToOne(() => EaftaArea, (eaftaArea) => eaftaArea.entregaRecepcionDetalle)
  @JoinColumn([{ name: "ID_AREA", referencedColumnName: "areaId" }])
  area: EaftaArea;



//   @OneToMany(
//     () => EaftaActaDetalle,
//     (eaftaActaDetalle) => eaftaActaDetalle.acta
//   )
//   detalle: EaftaActaDetalle[];

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasFinal)
//   @JoinColumn([{ name: "ESTADO_FINAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionFinal: EaftaEstadoSituacion;


}

