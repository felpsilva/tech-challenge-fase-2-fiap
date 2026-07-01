import { UserRepository } from '@/repositories/typeorm/user.repository';
import { SignInUseCase } from '../signin';

export function makeSignInUseCase() {
    const userRepository = new UserRepository();
    const signInUseCase = new SignInUseCase(userRepository);
    return signInUseCase;
}