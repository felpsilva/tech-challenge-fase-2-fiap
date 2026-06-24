import { IUser } from '@/entities/models/user.interface';
import { makeUpdateUserUseCase } from '@/use-cases/factory/make-update-user-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { hash } from 'bcryptjs';
import z from 'zod';

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const updateParamsSchema = z.object({
        id: z.coerce.number(),
    })

    const updateBodySchema = z.object({
        username: z.string().optional(),
        password: z.string().optional(),
        permission: z.string().optional(),
    })

    const { id } = updateParamsSchema.parse(request.params)
    const data = updateBodySchema.parse(request.body)

    if (data.password) {
        data.password = await hash(data.password, 8)
    }

    const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    ) as Partial<IUser>

    const updateUserUseCase = makeUpdateUserUseCase()

    try {
        const user = await updateUserUseCase.handler(id, updateData)

        if (!user) {
            return reply.status(404).send({ message: 'User not found' })
        }

        return reply.status(200).send({
            id: user.id,
            username: user.username,
            permission: user.permission,
            created_at: user.created_at,
        })
    } catch (error) {
        console.error('Error updating user:', error)
        return reply.status(500).send({ message: 'Error updating user' })
    }
}