import { PostRepository } from '@/repositories/typeorm/post.repository';
import { GetPostUseCase } from '../get-post';

export function makeGetPostUseCase() {
    const postRepository = new PostRepository()
    const getPostUseCase = new GetPostUseCase(postRepository)

    return getPostUseCase
}