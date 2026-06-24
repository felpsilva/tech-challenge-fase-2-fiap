import { makeDeletePostUseCase } from '@/use-cases/factory/make-delete-post-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    const deleteParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const { id } = deleteParamsSchema.parse(request.params)

    const deletePostUseCase = makeDeletePostUseCase()

    try {
        const deleted = await deletePostUseCase.handler(id)

        if (!deleted) {
            return reply.status(404).send({ message: 'Post not found' })
        }

        return reply.status(204).send()
    } catch (error) {
        console.error('Error deleting post:', error)
        return reply.status(500).send({ message: 'Error deleting post' })
    }
}