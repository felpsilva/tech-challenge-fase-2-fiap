import { CategoryRepository } from '@/repositories/typeorm/category.repository'
import { DeleteCategoryUseCase } from '../delete-category'

export function makeDeleteCategoryUseCase() {
    const categoryRepository = new CategoryRepository()
    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository)

    return deleteCategoryUseCase
}