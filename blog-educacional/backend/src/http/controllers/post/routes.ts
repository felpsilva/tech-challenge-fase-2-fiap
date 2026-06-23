import { FastifyInstance } from 'fastify';
import { create } from './create';

export async function postRoutes(app: FastifyInstance) {
    app.post('/post', create)
}