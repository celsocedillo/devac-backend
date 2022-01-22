import { Column, Entity, Index, OneToMany } from "typeorm";
import { EaftaActa } from './EaftaActa'
import { EaftaPermisoEstado } from "./EaftaPermisoEstado";

@Index("EAFTA_ESTADO_SITUACION_PK", ["idEstadoSituacion"], { unique: true })
@Entity("EAFTA_ESTADO_SITUACION")
export class EaftaEstadoSituacion {
  @Column("varchar2", { name: "GESTION", nullable: true, length: 1 })
  gestion: string | null;

  @Column("varchar2", { name: "ESTADO", nullable: true, length: 1 })
  estado: string | null;

  @Column("varchar2", { name: "DESCRIPCION", nullable: true, length: 200 })
  descripcion: string | null;

  @Column("number", { primary: true, name: "ID_ESTADO_SITUACION" })
  idEstadoSituacion: number;

  @OneToMany(
    () => EaftaActa,
    (eaftaActa) => eaftaActa.estadoSituacionInicial
  )
  actasInicial: EaftaActa[];

  @OneToMany(
    () => EaftaActa,
    (eaftaActa) => eaftaActa.estadoSituacionFinal
  )
  actasFinal: EaftaActa[];

  @OneToMany(
    () => EaftaPermisoEstado, (eaftaPermisoEstado) => eaftaPermisoEstado.estadoOrigen
  )
  permisosOrigen: EaftaPermisoEstado;

  @OneToMany(
    () => EaftaPermisoEstado, (eaftaPermisoEstado) => eaftaPermisoEstado.estadoDestino
  )
  permisosDestino: EaftaPermisoEstado;


}
