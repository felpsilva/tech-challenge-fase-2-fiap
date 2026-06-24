import { makeDeleteUserUseCase } from '@/use-cases/factory/make-delete-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    const deleteParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const { id } = deleteParamsSchema.parse(request.params)

    const deleteUserUseCase = makeDeleteUserUseCase()

    try {
        const deleted = await deleteUserUseCase.handler(id)

        if (!deleted) {
            return reply.status(404).send({ message: 'User not found' })
        }

        return reply.status(204).send()
    } catch (error) {
        console.error('Error deleting user:', error)
        return reply.status(500).send({ message: 'Error deleting user' })
    }
}