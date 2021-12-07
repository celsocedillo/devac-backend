import { Column, Entity, Index, ManyToOne, JoinColumn } from "typeorm";
import { EaftaEstadoSituacion } from "../entities/EaftaEstadoSituacion";

@Index(
  "EAFTA_PERMISO_ESTADO_PK",
  ["idUsuario", "idEstadoOrigen", "idEstadoDestino"],
  { unique: true }
)
@Entity("EAFTA_PERMISO_ESTADO")
export class EaftaPermisoEstado {
  @Column("number", { primary: true, name: "ID_ESTADO_DESTINO" })
  idEstadoDestino: number;

  @Column("number", { primary: true, name: "ID_ESTADO_ORIGEN" })
  idEstadoOrigen: number;

  @Column("varchar2", { primary: true, name: "ID_USUARIO", length: 20 })
  idUsuario: string;

  @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.permisosOrigen)
  @JoinColumn([{ name: "ID_ESTADO_ORIGEN", referencedColumnName: "idEstadoSituacion" }])
  estadoOrigen: EaftaEstadoSituacion;

  @ManyToOne(() => EaftaEstadoSituacion, (eaftaEstadoSituacion) => eaftaEstadoSituacion.permisosDestino)
  @JoinColumn([{ name: "ID_ESTADO_DESTINO", referencedColumnName: "idEstadoSituacion" }])
  estadoDestino: EaftaEstadoSituacion;


}
