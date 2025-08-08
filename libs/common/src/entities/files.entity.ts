// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity('arquivos')
// export class File {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   nome: string;

//   @Column({ nullable: true })
//   descricao?: string;

//   @Column()
//   categoria: string;

//   @Column()
//   originalFileName: string;

//   @Column()
//   lotacao: string;

//   @Column({ type: 'bytea' })
//   conteudo: Buffer;

//   @CreateDateColumn()
//   criadoEm: Date;

//   @Column({ nullable: true })
//   mimeType?: string;

//   @Column({ default: false})
//   fixado: boolean;
// }

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ARQUIVO_PORTAL' })
export class File {
  @PrimaryColumn({ name: 'CD_ARQUIVO', type: 'number' })
  id: number;

  @Column({ name: 'NM_ARQUIVO', type: 'varchar2', length: 200 })
  nome: string;

  @Column({ name: 'DS_ARQUIVO', type: 'varchar2', length: 2000, nullable: true })
  descricao?: string;

  @Column({ name: 'CD_TIPO_ARQUIVO', type: 'varchar2', length: 60 })
  categoria: string;

  @Column({ name: 'NM_ORIGINAL_ARQUIVO', type: 'varchar2', length: 400 })
  originalFileName: string;

  @Column({ name: 'CD_SETOR', type: 'number' })
  lotacao: number;

  @Column({ name: 'LO_ARQUIVO', type: 'blob' })
  conteudo: Buffer;

  @Column({ name: 'DT_PUBLICACAO', type: 'date' })
  criadoEm: Date;

  @Column({ name: 'DS_MIME_TYPE', type: 'varchar2', length: 200, nullable: true })
  mimeType?: string;

  @Column({ name: 'SN_FIXADO', type: 'varchar2', length: 1, nullable: true })
  fixado?: string;
}

