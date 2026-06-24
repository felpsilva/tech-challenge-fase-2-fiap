import { IPost } from '@/entities/models/post.interface';
import { IPostRepository } from '@/repositories/post.repository.interface';

export class GetPostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async handler(id: number): Promise<IPost | null> {
        return await this.postRepository.findById(id)
    }
}