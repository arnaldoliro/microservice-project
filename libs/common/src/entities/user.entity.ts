import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'SAC_USUARIOS' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'NOME'})
    nome: string

    @Column({name: 'EMAIL'})
    email: string

    @Column({name: 'SENHA'})
    senha: string

    @Column({name: 'MATRICULA'})
    matricula: string
}