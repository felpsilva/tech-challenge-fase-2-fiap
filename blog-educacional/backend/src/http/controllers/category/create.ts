import { makeCreateCategoryUseCase } from '@/use-cases/factory/make-create-category-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        slug: z.string(),
    })

    const { name, slug } = registerBodySchema.parse(request.body)

    const createdCategoryUseCase = makeCreateCategoryUseCase()
    try {
        const category = await createdCategoryUseCase.handler({
            name,
            slug
        })
        return reply.status(201).send(category)  
    } catch (error) {
        console.error('Error creating category:', error)
        return reply.status(500).send({ message: 'Error creating category' })
    }
}