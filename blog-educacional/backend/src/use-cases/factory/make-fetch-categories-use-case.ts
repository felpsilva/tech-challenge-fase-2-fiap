import { CategoryRepository } from '@/repositories/typeorm/category.repository'
import { FetchCategoriesUseCase } from '../fetch-categories'

export function makeFetchCategoriesUseCase() {
    const categoryRepository = new CategoryRepository()
    const fetchCategoriesUseCase = new FetchCategoriesUseCase(categoryRepository)

    return fetchCategoriesUseCase
}