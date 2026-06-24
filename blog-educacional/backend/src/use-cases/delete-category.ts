import { ICategoryRepository } from '@/repositories/category.repository.interface';

export class DeleteCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async handler(id: number): Promise<boolean> {
        return await this.categoryRepository.delete(id)
    }
}