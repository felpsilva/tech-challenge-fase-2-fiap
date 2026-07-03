import { FastifyInstance } from 'fastify';
import { create } from './create';
import { fetch } from './fetch';
import { get } from './get';
import { update } from './update';
import { remove } from './delete';
import { signin } from './signin';
import { authorizeRoles } from '@/http/middlewares/authorize-roles';

export async function userRoutes(app: FastifyInstance) {
    app.post('/user', { preHandler: authorizeRoles(['admin']) }, create)
    app.post('/user/signin', signin)
    app.get('/user', { preHandler: authorizeRoles(['admin']) }, fetch)
    app.get('/user/:id', { preHandler: authorizeRoles(['admin']) }, get)
    app.put('/user/:id', { preHandler: authorizeRoles(['admin']) }, update)
    app.delete('/user/:id', { preHandler: authorizeRoles(['admin']) }, remove)
}