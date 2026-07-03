import { FastifyInstance } from 'fastify';
import { create } from './create';
import { fetch } from './fetch';
import { get } from './get';
import { update } from './update';
import { remove } from './delete';
import { authorizeRoles } from '@/http/middlewares/authorize-roles';

export async function categoryRoutes(app: FastifyInstance) {
    app.post('/category', { preHandler: authorizeRoles(['admin', 'professor']) }, create)
    app.get('/category', { preHandler: authorizeRoles(['admin', 'professor']) }, fetch)
    app.get('/category/:id', { preHandler: authorizeRoles(['admin', 'professor']) }, get)
    app.put('/category/:id', { preHandler: authorizeRoles(['admin', 'professor']) }, update)
    app.delete('/category/:id', { preHandler: authorizeRoles(['admin', 'professor']) }, remove)
}