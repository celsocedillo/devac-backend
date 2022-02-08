import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { EaftaEntregaRecepcionDetalle } from './EaftaEntregaRecepcionDetalle'


@Index("EAFCN_AREA_PK", ["areaId"], { unique: true })
@Entity("EAFTA_AREA")
export class EaftaArea {

  @PrimaryGeneratedColumn({
      type: "number",
      name: "ID_AREA"
  })
  areaId: number;

  @Column("number", {
    name: "ID_EMPRESA",
    precision: 6,
    scale: 0,
  })
  empresaId: number | null;

  @Column("varchar2", { name: "DESCRIPCION", length: 100 })
  descripcion: string | null;

  @Column("varchar2", { name: "OBSERVACION", length: 100, nullable: true })
  observacion: string | null;

  @Column("number", {
    name: "ID_PERSONA_ENCARGADA",
    precision: 6,
    scale: 0,
    nullable: true
  })
  personaEncargaId: number | null;

  @Column("varchar2", { name: "BODEGA", length: 1, nullable: true })
  esBodega: string | null;

  @Column("date", { name: "FECHAING" })
  fechaIngresa: Date | null;

  @Column("varchar2", { name: "USUARING", nullable: true, length: 25 })
  usuarioIngresa: string | null;

  @Column("varchar2", { name: "ESTADO", length: 2 })
  estado: string | null;

  @Column("number", {
    name: "ID_BODEGA",
    precision: 6,
    scale: 0,
  })
  bodegaId: number | null;

  @Column("number", {
    name: "ID_DEPARTAMENTO",
    precision: 6,
    scale: 0,
  })
  departamentoId: number | null;


  @OneToMany(
    () => EaftaEntregaRecepcionDetalle,
    (eaftaEntregaRecepcionDetalle) => eaftaEntregaRecepcionDetalle.area
  )
  entregaRecepcionDetalle: EaftaEntregaRecepcionDetalle[];

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasInicial)
//   @JoinColumn([{ name: "ESTADO_INICIAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionInicial: EaftaEstadoSituacion;

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasFinal)
//   @JoinColumn([{ name: "ESTADO_FINAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionFinal: EaftaEstadoSituacion;


}

