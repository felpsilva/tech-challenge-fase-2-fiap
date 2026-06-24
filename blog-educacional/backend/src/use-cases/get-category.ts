import { ICategory } from '@/entities/models/category.interface';
import { ICategoryRepository } from '@/repositories/category.repository.interface';

export class GetCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async handler(id: number): Promise<ICategory | null> {
        return await this.categoryRepository.findById(id)
    }
}