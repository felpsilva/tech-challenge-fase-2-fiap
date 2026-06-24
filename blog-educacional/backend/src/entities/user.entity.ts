import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IUser } from './models/user.interface'

@Entity({
    name: 'users',
})
export class User implements IUser {
    @PrimaryGeneratedColumn("increment", {
        name: 'id'
    })
    id?: number

    @Column({
        name: 'username',
        type: 'varchar',
        length: 255,
        unique: true,
    })
    username: string

    @Column({
        name: 'password',
        type: 'varchar',
        length: 255,
    })
    password: string

    @Column({
        name: 'created_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date

    @Column({
        name: 'permission',
        type: 'varchar',
        length: 255,
    })
    permission: string
}