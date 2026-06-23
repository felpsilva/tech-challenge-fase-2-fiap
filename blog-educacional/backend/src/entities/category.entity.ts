import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ICategory } from './models/category.interface'
import { IPost } from './models/post.interface'
import { Post } from './post.entity'

@Entity({
    name: 'categories',
})
export class Category implements ICategory {
    @PrimaryGeneratedColumn("increment", {
        name: 'id'
    })
    id?: number | undefined

    @Column({
        name: 'name',
        type: 'varchar',
        length: 255,
    })
    name: string

    @Column({
        name: 'slug',
        type: 'varchar',
        length: 255,
    })
    slug: string

    @Column({
        name: 'created_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date

    @ManyToMany(() => Post,
        post => post.categories
    )
    posts: IPost[];
}