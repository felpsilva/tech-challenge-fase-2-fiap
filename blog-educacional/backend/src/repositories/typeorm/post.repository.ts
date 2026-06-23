import { Post } from '@/entities/post.entity';
import { IPostRepository } from '../post.repository.interface';
import { Repository } from 'typeorm';
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

}