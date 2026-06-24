import { FastifyInstance } from 'fastify';
import { create } from './create';
import { fetch } from './fetch';
import { get } from './get';
import { update } from './update';
import { remove } from './delete';

export async function categoryRoutes(app: FastifyInstance) {
    app.post('/category', create)
    app.get('/category', fetch)
    app.get('/category/:id', get)
    app.put('/category/:id', update)
    app.delete('/category/:id', remove)
}