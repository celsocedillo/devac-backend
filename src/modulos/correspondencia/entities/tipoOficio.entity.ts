import { Column, Entity, Index, PrimaryColumn, OneToMany } from "typeorm";
import { ReservaOficio } from './reservaOficio.entity'

@Index("CR_TIP_OFICIO_PK", ["id"], { unique: true })
@Entity("CR_TIP_OFICIO")
export class TipoOficio {
  @PrimaryColumn({
    type: "number",
    name: "TOF_CODIGO"
    })
    id: number;

  @Column("varchar2", { name: "TOF_DESCRIPCION", length: 50 })
  descripcion: string;

  @Column("varchar2", { name: "TOF_ESTADO", length: 1 })
  estado: string;

  @Column("varchar2", { name: "TOF_DESCRIPCION2", length: 100 })
  descripcion2: string;

  @Column("number", { name: "TOF_DPTO", nullable: true })
  departamentoId: number;

  @Column("varchar2", { name: "TOF_TIPO", length: 1 })
  tipo: number;

  @OneToMany(()=> ReservaOficio, (reservaOficio) => reservaOficio.tipoOficio)
  reservasOficio: ReservaOficio[];

}
