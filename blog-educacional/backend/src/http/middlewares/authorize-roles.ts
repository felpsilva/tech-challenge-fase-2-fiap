import { FastifyReply, FastifyRequest } from 'fastify';

type Permission = 'admin' | 'professor' | 'aluno';

export function authorizeRoles(allowedPermissions: Permission[]) {
    return async function authorize(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as { permission?: string } | undefined;

        if (!user?.permission) {
            return reply.status(403).send({ message: 'Forbidden' });
        }

        if (!allowedPermissions.includes(user.permission as Permission)) {
            return reply.status(403).send({ message: 'Forbidden' });
        }
    }
}