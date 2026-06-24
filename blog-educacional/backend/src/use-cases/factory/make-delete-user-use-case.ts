import { UserRepository } from '@/repositories/typeorm/user.repository'
import { DeleteUserUseCase } from '../delete-user'

export function makeDeleteUserUseCase() {
    const userRepository = new UserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(userRepository)

    return deleteUserUseCase
}