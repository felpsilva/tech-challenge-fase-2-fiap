import { IUser } from '@/entities/models/user.interface';
import { IUserRepository } from '@/repositories/user.repository.interface';

export class UpdateUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async handler(id: number, user: Partial<IUser>): Promise<IUser | null> {
        return await this.userRepository.update(id, user)
    }
}