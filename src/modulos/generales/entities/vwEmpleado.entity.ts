import { Column, Entity, Index, PrimaryColumn } from "typeorm";


@Entity("VW_EMPLEADO")
export class VwEmpleado {
  @PrimaryColumn({
    type: "number",
    name: "CODIGO"
    })
    codigo: number;

  @Column("varchar2", { name: "CEDULA", length : 2 })
  cedula: string;

  @Column("varchar2", { name: "EMPLEADO", length: 125 })
  empleado: string;

  @Column("number", { name: "CARGO_ID", precision: 6 })
  cargoId: number;

  @Column("varchar2", { name: "CARGO", length: 80 })
  cargo: string;

  @Column("number", { name: "DEPARTAMENTO_ID", precision: 3 })
  departamentoId: number;

  @Column("varchar2", { name: "DEPARTAMENTO", length: 255 })
  departamento: string;

  @Column("varchar2", { name: "USUARIO_JEFE_DEPARTAMENTO", length: 15 })
  usuarioJefeDepartamento: string;

  @Column("number", { name: "DIRECCION_ID", precision: 4 })
  direccionId: number;

  @Column("varchar2", { name: "USUARIO", length: 15 })
  usuario: string;

  @Column("varchar2", { name: "ESTADO", length: 1 })
  estado: string;

  @Column("varchar2", { name: "USUARIO_DISPLAY", length: 61 })
  usuarioDisplay: string;

  @Column("varchar2", { name: "EMAIL", length: 30 })
  email: string;

}

