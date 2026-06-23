import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IPost } from './models/post.interface';
import { ICategory } from './models/category.interface';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity({
    name: 'posts',
})
export class Post implements IPost {
    @PrimaryGeneratedColumn("increment", { 
        name: 'id' 
    })
    id?: number | undefined

    @Column({
        name: 'user_id',
        type: 'integer',
    })
    user_id: number

    @ManyToOne(() => User)
    @JoinColumn({
        name: 'user_id',
    })
    user: User;

    @Column({
        name: 'title',
        type: 'varchar',
        length: 255,
    })
    title: string
    @Column({
        name: 'slug',
        type: 'varchar',
        length: 255,
    })
    slug: string

    @Column({
        name: 'content',
        type: 'text',
    })
    content: string

    @Column({
        name: 'image_url',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    image_url?: string

    @Column({
        name: 'status',
        type: 'varchar',
        length: 50,
    })
    status: string

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @Column({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'post_categories',
        joinColumn: {
            name: 'post_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
    })
    categories?: ICategory[] | undefined
}