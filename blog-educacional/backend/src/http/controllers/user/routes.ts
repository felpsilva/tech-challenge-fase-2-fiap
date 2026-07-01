import { FastifyInstance } from 'fastify';
import { create } from './create';
import { fetch } from './fetch';
import { get } from './get';
import { update } from './update';
import { remove } from './delete';
import { signin } from './signin';

export async function userRoutes(app: FastifyInstance) {
    app.post('/user', create)
    app.post('/user/signin', signin)
    app.get('/user', fetch)
    app.get('/user/:id', get)
    app.put('/user/:id', update)
    app.delete('/user/:id', remove)
}