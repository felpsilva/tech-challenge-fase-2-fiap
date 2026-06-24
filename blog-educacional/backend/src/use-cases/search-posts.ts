import { IPost } from '@/entities/models/post.interface';
import { IPostRepository } from '@/repositories/post.repository.interface';

export class SearchPostsUseCase {
    constructor(private postRepository: IPostRepository) { }

    async handler(keyword: string): Promise<IPost[]> {
        return await this.postRepository.search(keyword)
    }
}