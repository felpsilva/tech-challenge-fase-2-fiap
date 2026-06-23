import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { hash } from 'bcryptjs';
import { makeCreateUserUseCase } from '@/use-cases/factory/make-create-user-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        username: z.string(),
        password: z.string(),
        permission: z.string()
    })

    const { username, password, permission } = registerBodySchema.parse(request.body)

    const hashedPassword = await hash(password, 8)

    const userWithHashedPassword = {username, password: hashedPassword, permission}
    const createdUserUseCase = makeCreateUserUseCase()

    const user = await createdUserUseCase.handler(userWithHashedPassword)

    return reply.status(201).send({ username: user?.username, id: user?.id, permission: user?.permission })
}