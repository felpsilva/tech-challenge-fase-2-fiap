import { IUserRepository } from '@/repositories/user.repository.interface';

export class DeleteUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async handler(id: number): Promise<boolean> {
        return await this.userRepository.delete(id)
    }
}