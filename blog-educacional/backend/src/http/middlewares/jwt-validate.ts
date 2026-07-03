import { FastifyReply, FastifyRequest } from 'fastify';

export async function validateJwt(request: FastifyRequest, reply: FastifyReply) {
    try {
        const rawUrl = request.raw.url;
        if (!rawUrl) {
            await request.jwtVerify();
            return;
        }

        const path = rawUrl.split('?')[0];
        if (!path) {
            await request.jwtVerify();
            return;
        }

        const route = path.replace(/\/$/, '');
        const method = request.method.toUpperCase();

        const publicRoutes = [
            { route: '/user/signin', method: 'POST' }
        ];

        const validRoute = publicRoutes.some(r => r.route === route && r.method === method);

        if (validRoute) {
            return;
        }
        await request.jwtVerify();
    }
    catch (err) {
        return reply.status(401).send({ message: 'Unauthorized' })
    }
}