import { UserRepository } from '@/repositories/typeorm/user.repository'
import { FetchUsersUseCase } from '../fetch-users'

export function makeFetchUsersUseCase() {
    const userRepository = new UserRepository()
    const fetchUsersUseCase = new FetchUsersUseCase(userRepository)

    return fetchUsersUseCase
}