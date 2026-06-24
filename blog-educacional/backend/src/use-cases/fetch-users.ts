import { IUser } from '@/entities/models/user.interface';
import { IUserRepository } from '@/repositories/user.repository.interface';

export class FetchUsersUseCase {
    constructor(private userRepository: IUserRepository) { }

    async handler(): Promise<IUser[]> {
        return await this.userRepository.findAll()
    }
}