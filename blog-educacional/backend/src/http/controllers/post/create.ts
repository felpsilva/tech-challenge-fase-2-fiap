import { makeCreatePostUseCase } from '@/use-cases/factory/make-create-post-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        user_id : z.coerce.number(),
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        image_url: z.string().optional(),
        status: z.string().default('draft'),
        categories: z.array(
            z.object({
                id: z.coerce.number().optional(),
                name: z.string(),
                slug: z.string(),
            })
        ).optional()
    })

    const { user_id, title, slug, content, image_url, status, categories } = registerBodySchema.parse(request.body)

    const createdProductUseCase = makeCreatePostUseCase()
    try {
    const post = await createdProductUseCase.handler({
        user_id,
        title,
        slug,
        content,
        image_url,
        status,
        categories
    })
        return reply.status(201).send(post)

    } catch (error) {
        console.error('Error creating post:', error)
        return reply.status(500).send({ message: 'Error creating post' })
    }
}
