import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("GECN_TIPOS_PK", ["id"], { unique: true })
@Entity("GE_TIPOS")
export class Tipos {
  @PrimaryGeneratedColumn({
    type: "number",
    name: "ID"
    })
    id: number;

  @Column("number", { name: "TIPO_ID", precision: 2 })
  tipoId: number;

  @Column("varchar2", { name: "CODIGO", length: 2 })
  codigo: string;

  @Column("varchar2", { name: "DESCRIPCION", length: 250 })
  descripcion: string;

  @Column("varchar2", { name: "ESTADO", length: 2 })
  estado: string;



}
