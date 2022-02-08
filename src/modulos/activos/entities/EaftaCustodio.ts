import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { VwActivoGeneral } from './VwActivoGeneral'

@Index("EAFCN_CUSTODIO_PK", ["custodioId"], { unique: true })
@Entity("EAFTA_CUSTODIO")
export class EaftaCustodio {

  @PrimaryGeneratedColumn({
      type: "number",
      name: "ID_CUSTODIO"
  })
  custodioId: number;
      
  @Column("number", {
    name: "ID_CUSTODIO_PERSONA",
    precision: 6,
    scale: 0,
  })
  custodioPersonaId: number | null;

  @Column("number", {
    name: "ID_ACTIVO",
    precision: 6,
    scale: 0,
  })
  activoId: number | null;

  @Column("varchar2", { name: "OBSERVACION", nullable: true, length: 500 })
  observacion: string | null;

  @Column("date", { name: "FECHAING" })
  fechaIngresa: Date | null;

  @Column("varchar2", { name: "USUARING", nullable: true, length: 25 })
  usuarioIngresa: string | null;

  @Column("varchar2", { name: "ESTADO", length: 2 })
  estado: string | null;

  @Column("number", {
    name: "ID_AREA",
    precision: 3,
    scale: 0,
  })
  areaId: number | null;


  @ManyToOne(() => VwActivoGeneral, (vwActivoGeneral) => vwActivoGeneral.entregaRecepcionDetalle)
  @JoinColumn([{ name: "ID_ACTIVO", referencedColumnName: "activoId" }])
  activo: VwActivoGeneral;




//   @OneToMany(
//     () => EaftaActaDetalle,
//     (eaftaActaDetalle) => eaftaActaDetalle.acta
//   )
//   detalle: EaftaActaDetalle[];

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasInicial)
//   @JoinColumn([{ name: "ESTADO_INICIAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionInicial: EaftaEstadoSituacion;

//   @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasFinal)
//   @JoinColumn([{ name: "ESTADO_FINAL", referencedColumnName: "idEstadoSituacion" }])
//   estadoSituacionFinal: EaftaEstadoSituacion;


}


