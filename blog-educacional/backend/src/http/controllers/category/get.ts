import { makeGetCategoryUseCase } from '@/use-cases/factory/make-get-category-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function get(request: FastifyRequest, reply: FastifyReply) {
    const getParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const { id } = getParamsSchema.parse(request.params)

    const getCategoryUseCase = makeGetCategoryUseCase()

    try {
        const category = await getCategoryUseCase.handler(id)

        if (!category) {
            return reply.status(404).send({ message: 'Category not found' })
        }

        return reply.status(200).send(category)
    } catch (error) {
        console.error('Error getting category:', error)
        return reply.status(500).send({ message: 'Error getting category' })
    }
}