import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('arquivos')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'bytea' })
  conteudo: Buffer;

  @CreateDateColumn()
  criadoEm: Date;
}
