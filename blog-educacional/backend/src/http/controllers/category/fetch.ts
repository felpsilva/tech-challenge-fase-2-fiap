import { makeFetchCategoriesUseCase } from '@/use-cases/factory/make-fetch-categories-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
    const fetchCategoriesUseCase = makeFetchCategoriesUseCase()

    try {
        const categories = await fetchCategoriesUseCase.handler()
        return reply.status(200).send(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return reply.status(500).send({ message: 'Error fetching categories' })
    }
}