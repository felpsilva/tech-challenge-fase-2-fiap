import { ICategory } from '@/entities/models/category.interface';
import { ICategoryRepository } from '@/repositories/category.repository.interface';

export class CreateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async handler(category: ICategory): Promise<ICategory | undefined> {
        return await this.categoryRepository.create(category)
    }
}