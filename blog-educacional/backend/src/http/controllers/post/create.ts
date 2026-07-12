import { ICategory } from '@/entities/models/category.interface';
import { makeCreatePostUseCase } from '@/use-cases/factory/make-create-post-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import z from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        user_id: z.coerce.number(),
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        image_url: z.string().optional(),
        status: z.string().default('draft'),
        categories: z.array(
            z.object({
                id: z.coerce.number(),
                name: z.string().optional(),
                slug: z.string().optional(),
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
            categories: categories as ICategory[] | undefined,
        })
        return reply.status(201).send(post)

    } catch (error) {
        if (error instanceof QueryFailedError) {
            const driverError = error.driverError as { code?: string; constraint?: string } | undefined
            if (driverError?.code === '23503' && driverError.constraint === 'posts_user_id_fkey') {
                return reply.status(400).send({ message: 'user_id not found' })
            }
        }

        console.error('Error creating post:', error)
        return reply.status(500).send({ message: 'Error creating post' })
    }
}
