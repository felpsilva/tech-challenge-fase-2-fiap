import { CategoryRepository } from '@/repositories/typeorm/category.repository'
import { UpdateCategoryUseCase } from '../update-category'

export function makeUpdateCategoryUseCase() {
    const categoryRepository = new CategoryRepository()
    const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)

    return updateCategoryUseCase
}