import { ICategory } from '@/entities/models/category.interface';
import { makeUpdateCategoryUseCase } from '@/use-cases/factory/make-update-category-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const updateParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const updateBodySchema = z.object({
        name: z.string().optional(),
        slug: z.string().optional(),
    })

    const { id } = updateParamsSchema.parse(request.params)
    const data = updateBodySchema.parse(request.body)

    const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    ) as Partial<ICategory>

    const updateCategoryUseCase = makeUpdateCategoryUseCase()

    try {
        const category = await updateCategoryUseCase.handler(id, updateData)

        if (!category) {
            return reply.status(404).send({ message: 'Category not found' })
        }

        return reply.status(200).send(category)
    } catch (error) {
        console.error('Error updating category:', error)
        return reply.status(500).send({ message: 'Error updating category' })
    }
}