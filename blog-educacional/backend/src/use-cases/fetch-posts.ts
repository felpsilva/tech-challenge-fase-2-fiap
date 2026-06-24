import { IPost } from '@/entities/models/post.interface';
import { IPostRepository } from '@/repositories/post.repository.interface';

export class FetchPostsUseCase {
    constructor(private postRepository: IPostRepository) { }

    async handler(): Promise<IPost[]> {
        return await this.postRepository.findAll()
    }
}