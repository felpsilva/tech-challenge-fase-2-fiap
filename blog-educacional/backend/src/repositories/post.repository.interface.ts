import { IPost } from '@/entities/models/post.interface';

export interface IPostRepository {
    create(post: IPost): Promise<IPost>
    findAll(): Promise<IPost[]>
    findById(id: number): Promise<IPost | null>
    search(keyword: string): Promise<IPost[]>
    update(id: number, post: Partial<IPost>): Promise<IPost | null>
    delete(id: number): Promise<boolean>
}