import { UserRepository } from '@/repositories/typeorm/user.repository'
import { GetUserUseCase } from '../get-user'

export function makeGetUserUseCase() {
    const userRepository = new UserRepository()
    const getUserUseCase = new GetUserUseCase(userRepository)

    return getUserUseCase
}