import 'reflect-metadata'
import fastify from 'fastify'
import cors from '@fastify/cors'
import '@/lib/typeorm/typeorm'
import { userRoutes } from '@/http/controllers/user/routes';
import { postRoutes } from '@/http/controllers/post/routes';
import { categoryRoutes } from './http/controllers/category/routes';

export const app = fastify()

app.register(cors, {
    origin: true,
})

app.register(userRoutes)
app.register(postRoutes)
app.register(categoryRoutes)

