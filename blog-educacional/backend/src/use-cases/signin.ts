import { IUserRepository } from '@/repositories/user.repository.interface';
import { InvalidCredentialsError } from './errors/invalid-credentials-errors';

export class SignInUseCase {
    constructor(private userRepository: IUserRepository) { }
    async handler(username: string): Promise<boolean> {
        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        return user
    }
}
