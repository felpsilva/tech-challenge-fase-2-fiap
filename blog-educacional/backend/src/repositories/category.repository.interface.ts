import { ICategory } from '@/entities/models/category.interface';

export interface ICategoryRepository {
    create(category: ICategory): Promise<ICategory | undefined>
    findAll(): Promise<ICategory[]>
    findById(id: number): Promise<ICategory | null>
    update(id: number, category: Partial<ICategory>): Promise<ICategory | null>
    delete(id: number): Promise<boolean>
}