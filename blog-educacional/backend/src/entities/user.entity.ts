import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { IUser } from './models/user.interface'
import { IPost } from './models/post.interface'
import { Post } from './post.entity'

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
    })
    username: string

    @Column({
        name: 'password',
        type: 'varchar',
    })
    password: string

    @Column({
        name: 'created_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date

    @Column({
        name: 'permission',
        type: 'varchar',
        nullable: true
    })
    permission: string
}