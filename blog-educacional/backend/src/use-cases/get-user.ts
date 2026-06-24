import { IUser } from '@/entities/models/user.interface';
import { IUserRepository } from '@/repositories/user.repository.interface';

export class GetUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async handler(id: number): Promise<IUser | null> {
        return await this.userRepository.findById(id)
    }
}