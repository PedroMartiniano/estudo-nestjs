import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class UserEntity {

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id: number

    @Column({
        length: 63
    })
    name: string

    @Column({
        length: 127,
        unique: true
    })
    email: string

    @Column({
        length: 127
    })
    user_password: string

    @Column({
        type: 'date'
    })
    birthAt: string

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    @Column({
        default: 1
    })
    role: number
}