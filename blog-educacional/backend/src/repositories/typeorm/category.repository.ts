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

    async findAll(): Promise<ICategory[]> {
        return await this.repository.find({
            order: { created_at: 'DESC' },
        })
    }

    async findById(id: number): Promise<ICategory | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async update(id: number, category: Partial<ICategory>): Promise<ICategory | null> {
        const existingCategory = await this.repository.findOne({ where: { id } })

        if (!existingCategory) {
            return null
        }

        const updatedCategory = this.repository.merge(existingCategory, category)

        return await this.repository.save(updatedCategory)
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete({ id })
        return !!result.affected && result.affected > 0
    }
}