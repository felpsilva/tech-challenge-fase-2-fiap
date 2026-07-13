import 'reflect-metadata'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt';
import '@/lib/typeorm/typeorm'
import { userRoutes } from '@/http/controllers/user/routes';
import { postRoutes } from '@/http/controllers/post/routes';
import { categoryRoutes } from './http/controllers/category/routes';
import { env } from './env';
import { validateJwt } from './http/middlewares/jwt-validate';
import { globalErrorHandler } from './utils/global-error-handler';

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: '1h' }
})

app.addHook('onRequest', validateJwt)
app.setErrorHandler(globalErrorHandler)

app.register(userRoutes)
app.register(postRoutes)
app.register(categoryRoutes)