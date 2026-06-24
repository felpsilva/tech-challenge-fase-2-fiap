import { makeGetPostUseCase } from '@/use-cases/factory/make-get-post-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function get(request: FastifyRequest, reply: FastifyReply) {
    const getParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const { id } = getParamsSchema.parse(request.params)

    const getPostUseCase = makeGetPostUseCase()

    try {
        const post = await getPostUseCase.handler(id)

        if (!post) {
            return reply.status(404).send({ message: 'Post not found' })
        }

        return reply.status(200).send(post)
    } catch (error) {
        console.error('Error getting post:', error)
        return reply.status(500).send({ message: 'Error getting post' })
    }
}