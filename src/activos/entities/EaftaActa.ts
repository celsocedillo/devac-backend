import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { EaftaActaDetalle } from "./EaftaActaDetalle";
import { EaftaEstadoSituacion } from "./EaftaEstadoSituacion";


@Index("EAFCN_ACTA_PK", ["actaId"], { unique: true })
@Entity("EAFTA_ACTA")
export class EaftaActa {
  @Column("number", {
    name: "ACTA_ID_REFERENCIA",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  actaIdReferencia: number | null;

  @Column("varchar2", { name: "ACTA_COMPENSACION", nullable: true, length: 2 })
  actaCompensacion: string | null;

  @Column("number", {
    name: "TOTAL_VALOR",
    nullable: true,
    precision: 12,
    scale: 2,
  })
  totalValor: number | null;

  @Column("number", {
    name: "NUMERO_ACTIVOS",
    nullable: true,
    precision: 10,
    scale: 0,
  })
  numeroActivos: number | null;

  @Column("varchar2", { name: "ESTADO", nullable: true, length: 2 })
  estado: string | null;

  @Column("date", { name: "FECHA_APRUEBA", nullable: true })
  fechaAprueba: Date | null;

  @Column("date", { name: "FECHA_INGRESA", nullable: true })
  fechaIngresa: Date | null;

  @Column("varchar2", { name: "USUARIO_APRUEBA", nullable: true, length: 25 })
  usuarioAprueba: string | null;

  @Column("varchar2", { name: "USUARIO_SUPERVISA", nullable: true, length: 25 })
  usuarioSupervisa: string | null;

  @Column("varchar2", { name: "USUARIO_INGRESA", nullable: true, length: 25 })
  usuarioIngresa: string | null;

  @Column("number", {
    name: "ESTADO_FINAL",
    nullable: true,
    precision: 2,
    scale: 0,
  })
  estadoFinal: number | null;

  @Column("number", {
    name: "ESTADO_INICIAL",
    nullable: true,
    precision: 2,
    scale: 0,
  })
  estadoInicial: number | null;

  @Column("varchar2", { name: "COMENTARIOS", nullable: true, length: 500 })
  comentarios: string | null;

  @Column("varchar2", { name: "NUMERO_ACTA", nullable: true, length: 50 })
  numeroActa: string | null;

  @Column("date", { name: "FECHA_ACTA", nullable: true })
  fechaActa: Date | null;

  // @Column("number", { primary: true, name: "ACTA_ID", precision: 10, scale: 0 })
  // actaId: number;

  @PrimaryGeneratedColumn({
    type: "number",
    name: "ACTA_ID"
    //precision: 12,
    //scale: 0,
  })
  actaId: number;

  @OneToMany(
    () => EaftaActaDetalle,
    (eaftaActaDetalle) => eaftaActaDetalle.acta
  )
  detalle: EaftaActaDetalle[];

  @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasInicial)
  @JoinColumn([{ name: "ESTADO_INICIAL", referencedColumnName: "idEstadoSituacion" }])
  estadoSituacionInicial: EaftaEstadoSituacion;

  @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.actasFinal)
  @JoinColumn([{ name: "ESTADO_FINAL", referencedColumnName: "idEstadoSituacion" }])
  estadoSituacionFinal: EaftaEstadoSituacion;


}
