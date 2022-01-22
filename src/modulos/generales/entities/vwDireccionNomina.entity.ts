import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { ReservaOficio } from '../../correspondencia/entities/reservaOficio.entity'

@Entity("VW_DIRECCION_NOMINA")
export class VwDireccionNomina {
  @PrimaryColumn({
    type: "number",
    name: "ID"
    })
    id: number;

  @Column("varchar2", { name: "DIRECCION", length: 255 })
  direccion: string;

  @Column("varchar2", { name: "ESTADO", length: 1 })
  estado: string;

  @Column("varchar2", { name: "SIGLA", length: 250 })
  sigla: string;

  @OneToMany(()=> ReservaOficio, (reservaOficio) => reservaOficio.tipoOficio)
  reservasOficio: ReservaOficio[];

  


}
