import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { EaftaActaDetalle } from "./EaftaActaDetalle";

//@Index("EAFCN_ACTA_PK", ["actaId"], { unique: true })
@Entity("VW_ACTIVO_GENERAL")
export class VwActivoGeneral {

  @Column("number", { primary: true, name: "ID_ACTIVO", precision: 6, scale: 0 })
  activoId: number;

  @Column("varchar2", { name: "CODIGO_ECAPAG", nullable: true, length: 15 })
  codigoEcapag: string | null;

  @Column("number", { name: "CODIGO_ACTIVO_CONTROL", nullable: true, precision: 6, scale: 0,})
  codigoActivoControl: number | null;

  @Column("varchar2", { name: "CODIGO_CONCESIONARIA", nullable: true, length: 15 })
  codigoConcesionaria: string | null;

  @Column("varchar2", { name: "CODIGO_MUNICIPIO", nullable: true, length: 25 })
  codigoMunicipio: string | null;

  @Column("number", { name: "ID_TIPO_ACTIVO", precision: 3, scale: 0,})
  tipoActivoId: number | null;

  @Column("number", { name: "ID_CLASE_ACTIVO", precision: 3, scale: 0,})
  claseActivoId: number | null;
  
  @Column("number", { name: "ID_ESTADO_SITUACION", precision: 2, scale: 0,})
  estadoSituacionId: number | null;

  @Column("varchar2", { name: "TIPO_ACTIVO", nullable: true, length: 100 })
  tipoActivo: string | null;
  
  @Column("varchar2", { name: "CLASE_ACTIVO", nullable: true, length: 100 })
  claseActivo: string | null;
  
  @Column("varchar2", { name: "DESCRIPCION", nullable: true, length: 1000 })
  descripcion: string | null;
  
  @Column("varchar2", { name: "ESTADO_SITUACION", nullable: true, length: 200 })
  estadoSituacion: string | null;

  @Column("date", { name: "FECHA_INGRESO", nullable: true })
  fechaIngreso: Date | null;

  @Column("date", { name: "FECHA_ULT_CAMBIO", nullable: true })
  fechaUltCambio: Date | null;

  @Column("number", {name: "VALOR_COMPRA", nullable: true, precision: 15, scale: 2,  })
  valorCompra: number | null;

  @Column("number", {name: "VALOR_IVA", nullable: true, precision: 15, scale: 2,  })
  valorIva: number | null;

  @Column("number", {name: "VALOR_DEPRECIADO", nullable: true, precision: 15, scale: 2,  })
  valorDepreciado: number | null;

  @Column("varchar2", { name: "MARCA", nullable: true, length: 100 })
  marca: string | null;

  @Column("varchar2", { name: "MODELO", nullable: true, length: 100 })
  modelo: string | null;

  @Column("varchar2", { name: "SERIE", nullable: true, length: 100 })
  serie: string | null;

  @Column("varchar2", { name: "ANIO", nullable: true, length: 100 })
  anio: string | null;

  @Column("varchar2", { name: "PLACA", nullable: true, length: 100 })
  placa: string | null;

  @Column("varchar2", { name: "MOTOR", nullable: true, length: 100 })
  motor: string | null;

  @Column("varchar2", { name: "CHASIS", nullable: true, length: 100 })
  chasis: string | null;

  @Column("varchar2", { name: "DISCO", nullable: true, length: 100 })
  disco: string | null;

  @Column("varchar2", { name: "UBICACION", nullable: true, length: 100 })
  ubicacion: string | null;

  @Column("varchar2", { name: "OBSERVACION", nullable: true, length: 100 })
  observacion: string | null;

  @Column("varchar2", { name: "ESCRITURAS", nullable: true, length: 100 })
  escrituras: string | null;

  @Column("varchar2", { name: "ESTADO", nullable: true, length: 100 })
  estado: string | null;

  @OneToMany(
    () => EaftaActaDetalle,
    (eaftaActaDetalle) => eaftaActaDetalle.activo
  )
  actaDetalles: EaftaActaDetalle[];

  

}
