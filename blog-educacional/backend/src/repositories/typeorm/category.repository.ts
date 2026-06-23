import { Repository } from 'typeorm';
import { appDataSource } from '@/lib/typeorm/typeorm';
import { Category } from '@/entities/category.entity';
import { ICategory } from '@/entities/models/category.interface';
import { ICategoryRepository } from '../category.repository.interface';

export class CategoryRepository implements ICategoryRepository {
    private repository: Repository<Category>

    constructor() {
        this.repository = appDataSource.getRepository(Category)
    }

    async create(category: ICategory): Promise<ICategory | undefined> {
        return await this.repository.save(category)
    }
}