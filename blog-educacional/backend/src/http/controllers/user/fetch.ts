import { makeFetchUsersUseCase } from '@/use-cases/factory/make-fetch-users-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
    const fetchUsersUseCase = makeFetchUsersUseCase()

    try {
        const users = await fetchUsersUseCase.handler()
        const usersView = users.map((user) => ({
            id: user.id,
            username: user.username,
            permission: user.permission,
            created_at: user.created_at,
        }))
        return reply.status(200).send(usersView)
    } catch (error) {
        console.error('Error fetching users:', error)
        return reply.status(500).send({ message: 'Error fetching users' })
    }
}