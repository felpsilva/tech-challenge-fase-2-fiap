import { CategoryRepository } from '@/repositories/typeorm/category.repository'
import { GetCategoryUseCase } from '../get-category'

export function makeGetCategoryUseCase() {
    const categoryRepository = new CategoryRepository()
    const getCategoryUseCase = new GetCategoryUseCase(categoryRepository)

    return getCategoryUseCase
}