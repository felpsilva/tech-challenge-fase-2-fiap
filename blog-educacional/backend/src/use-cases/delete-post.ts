import { IPostRepository } from '@/repositories/post.repository.interface';

export class DeletePostUseCase {
    constructor(private postRepository: IPostRepository) { }

    async handler(id: number): Promise<boolean> {
        return await this.postRepository.delete(id)
    }
}