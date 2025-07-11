import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('arquivos')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column()
  categoria: string;

  @Column()
  originalFileName: string;

  @Column()
  lotacao: string;

  @Column({ type: 'bytea' })
  conteudo: Buffer;

  @CreateDateColumn()
  criadoEm: Date;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ default: false})
  fixado: boolean;
}
