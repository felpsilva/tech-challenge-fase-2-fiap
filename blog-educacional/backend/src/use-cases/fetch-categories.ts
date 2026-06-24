import { ICategory } from '@/entities/models/category.interface';
import { ICategoryRepository } from '@/repositories/category.repository.interface';

export class FetchCategoriesUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async handler(): Promise<ICategory[]> {
        return await this.categoryRepository.findAll()
    }
}