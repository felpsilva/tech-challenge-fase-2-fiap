import { Post } from '@/entities/post.entity';
import { IPostRepository } from '../post.repository.interface';
import { ILike, Repository } from 'typeorm';
import { appDataSource } from '@/lib/typeorm/typeorm';
import { IPost } from '@/entities/models/post.interface';

export class PostRepository implements IPostRepository {
    private repository: Repository<Post>

    constructor() {
        this.repository = appDataSource.getRepository(Post)
    }

    async create(post: IPost): Promise<IPost> {
        return await this.repository.save(post)
    }

    async findAll(): Promise<IPost[]> {
        return await this.repository.find({
            relations: { user: true, categories: true },
            order: { created_at: 'DESC' },
        })
    }

    async findById(id: number): Promise<IPost | null> {
        return await this.repository.findOne({
            where: { id },
            relations: { user: true, categories: true },
        })
    }

    async search(keyword: string): Promise<IPost[]> {
        return await this.repository.find({
            where: [
                { title: ILike(`%${keyword}%`) },
                { content: ILike(`%${keyword}%`) },
            ],
            relations: { user: true, categories: true },
            order: { created_at: 'DESC' },
        })
    }

    async update(id: number, post: Partial<IPost>): Promise<IPost | null> {
        const existingPost = await this.repository.findOne({ where: { id } })

        if (!existingPost) {
            return null
        }

        const updatedPost = this.repository.merge(existingPost, {
            ...post,
            updated_at: new Date(),
        })

        return await this.repository.save(updatedPost)
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete({ id })
        return !!result.affected && result.affected > 0
    }
}