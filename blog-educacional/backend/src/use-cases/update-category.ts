import { ICategory } from '@/entities/models/category.interface';
import { ICategoryRepository } from '@/repositories/category.repository.interface';

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async handler(id: number, category: Partial<ICategory>): Promise<ICategory | null> {
        return await this.categoryRepository.update(id, category)
    }
}