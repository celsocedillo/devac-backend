import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { EaftaActa } from "./EaftaActa";
import { VwActivoGeneral } from "./VwActivoGeneral";

@Index("EAFCN_ACTADETALLE_PK", ["actadetId"], { unique: true })
@Entity("EAFTA_ACTA_DETALLE")
export class EaftaActaDetalle {
  @Column("number", {
    name: "ACTIVO_COMPENSADO",
    nullable: true,
    precision: 6,
    scale: 0,
  })
  activoCompensado: number | null;

  @Column("varchar2", {
    name: "REFERENCIA_COMPENSACION",
    nullable: true,
    length: 250,
  })
  referenciaCompensacion: string | null;

  @Column("number", {
    primary: true,
    name: "ACTADET_ID",
    precision: 10,
    scale: 0,
  })
  actadetId: number;

  @Column("number", {
    name: "VALOR_COMPRA_IVA",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  valorCompraIva: number | null;

  @Column("date", { name: "FECHA_ULT_CAMBIO", nullable: true })
  fechaUltCambio: Date | null;

  @Column("varchar2", { name: "ESTADO", nullable: true, length: 2 })
  estado: string | null;

  @Column("date", { name: "FECHA_INGRESO", nullable: true })
  fechaIngreso: Date | null;

  @Column("varchar2", { name: "USUARIO_INGRESA", nullable: true, length: 25 })
  usuarioIngresa: string | null;

  @Column("varchar2", {
    name: "CODIGO_CONCESIONARIA",
    nullable: true,
    length: 15,})
  codigoConcesionaria: string | null;

  @Column("varchar2", { name: "CODIGO", nullable: true, length: 15 })
  codigo: string | null;

  @Column("number", {
    name: "ACTIVO_ID",
    precision: 6,
    scale: 0,
  })
  activoId: number | null;

  @Column("number", {
    name: "ACTA_ID",
    precision: 6,
    scale: 0,
  })
  actaId: number | null;

  @ManyToOne(() => EaftaActa, (eaftaActa) => eaftaActa.detalle)
  @JoinColumn([{ name: "ACTA_ID", referencedColumnName: "actaId" }])
  acta: EaftaActa;

  @ManyToOne(() => VwActivoGeneral, (vwActivoGeneral) => vwActivoGeneral.actaDetalles)
  @JoinColumn([{ name: "ACTIVO_ID", referencedColumnName: "activoId" }])
  activo: EaftaActa;

}
