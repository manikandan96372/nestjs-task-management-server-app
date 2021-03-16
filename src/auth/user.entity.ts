import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcryptjs'
import { Tasks } from "../tasks/tasks.entity";

@Unique(['username'])
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    salt: string

    @OneToMany(type => Tasks, tasks => tasks.user, { eager: true })
    tasks: Tasks[]

    async validatePassword(password: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(password, this.salt)
        return this.password === hashedPassword
    }
}