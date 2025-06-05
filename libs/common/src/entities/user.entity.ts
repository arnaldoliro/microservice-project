import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'SAC_USUARIO' })
export class User {
    @PrimaryGeneratedColumn({name: 'SEQUENCIA'})
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