import { FastifyReply, FastifyRequest } from 'fastify';

export async function validateJwt(request: FastifyRequest, reply: FastifyReply) {
    try {
        const route = request.url;
        const method = request.method;
        console.log('Route:', route, 'Method:', method);

        const publicRoutes = [
            { route: '/user', method: 'POST' },
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