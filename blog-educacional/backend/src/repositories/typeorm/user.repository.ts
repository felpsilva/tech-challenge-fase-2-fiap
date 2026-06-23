import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { IUserRepository } from '../user.repository.interface';
import { appDataSource } from '@/lib/typeorm/typeorm';
import { IUser } from '@/entities/models/user.interface';

export class UserRepository implements IUserRepository {
    private repository: Repository<User>

    constructor() {
        this.repository = appDataSource.getRepository(User)
    }

    async create(user: IUser): Promise<IUser | undefined> {
        return await this.repository.save(user)
    }
}