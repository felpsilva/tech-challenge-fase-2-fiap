import { makeFetchPostsUseCase } from '@/use-cases/factory/make-fetch-posts-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
    const fetchPostsUseCase = makeFetchPostsUseCase()

    try {
        const posts = await fetchPostsUseCase.handler()
        return reply.status(200).send(posts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        return reply.status(500).send({ message: 'Error fetching posts' })
    }
}