import { IUser } from '@/entities/models/user.interface';
import { IUserRepository } from '@/repositories/user.repository.interface';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

export class GetUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async handler(id: number): Promise<IUser | null> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new ResourceNotFoundError();
        return user;
    }
}