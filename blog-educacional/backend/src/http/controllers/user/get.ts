import { makeGetUserUseCase } from '@/use-cases/factory/make-get-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function get(request: FastifyRequest, reply: FastifyReply) {
    const getParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const { id } = getParamsSchema.parse(request.params)

    const getUserUseCase = makeGetUserUseCase()

    try {
        const user = await getUserUseCase.handler(id)

        if (!user) {
            return reply.status(404).send({ message: 'User not found' })
        }

        return reply.status(200).send({
            id: user.id,
            username: user.username,
            permission: user.permission,
            created_at: user.created_at,
        })
    } catch (error) {
        console.error('Error getting user:', error)
        return reply.status(500).send({ message: 'Error getting user' })
    }
}