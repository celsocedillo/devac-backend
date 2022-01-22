import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Index("CR_ESTADO_PK", ["id"], { unique: true })
@Entity("CR_ESTADO")
export class Estado {
  @PrimaryColumn({
    type: "varchar2",
    name: "EST_CODIGO"
    })
    id: number;

  @Column("varchar2", { name: "EST_DESCRIPCION", length: 30 })
  descripcion: string;

  @Column("varchar2", { name: "EST_ESTADO", length: 1 })
  estado: string;



}
