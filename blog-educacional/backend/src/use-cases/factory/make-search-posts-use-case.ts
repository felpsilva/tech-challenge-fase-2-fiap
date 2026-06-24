import { PostRepository } from '@/repositories/typeorm/post.repository';
import { SearchPostsUseCase } from '../search-posts';

export function makeSearchPostsUseCase() {
    const postRepository = new PostRepository()
    const searchPostsUseCase = new SearchPostsUseCase(postRepository)

    return searchPostsUseCase
}