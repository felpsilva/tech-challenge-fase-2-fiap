import { ICategory } from '@/entities/models/category.interface';

export interface ICategoryRepository {
    create(category: ICategory): Promise<ICategory | undefined>
}