import { PostRepository } from '@/repositories/typeorm/post.repository';
import { FetchPostsUseCase } from '../fetch-posts';

export function makeFetchPostsUseCase() {
    const postRepository = new PostRepository()
    const fetchPostsUseCase = new FetchPostsUseCase(postRepository)

    return fetchPostsUseCase
}