import { FastifyInstance } from 'fastify';
import { create } from './create';
import { fetch } from './fetch';
import { search } from './search';
import { get } from './get';
import { update } from './update';
import { remove } from './delete';

export async function postRoutes(app: FastifyInstance) {
    app.post('/post', create)
    app.get('/post', fetch)
    app.get('/post/search', search)
    app.get('/post/:id', get)
    app.put('/post/:id', update)
    app.delete('/post/:id', remove)
}