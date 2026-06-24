import { IPost } from '@/entities/models/post.interface';
import { IPostRepository } from '@/repositories/post.repository.interface';

export class UpdatePostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async handler(id: number, post: Partial<IPost>): Promise<IPost | null> {
        return await this.postRepository.update(id, post)
    }
}