import fastify, { FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { hash } from 'bcryptjs'
import { validateJwt } from '@/http/middlewares/jwt-validate'

type TestUser = {
    id: number
    username: string
    password: string
    permission: string
}

const users = new Map<string, TestUser>()
let nextUserId = 1

jest.mock('@/repositories/typeorm/user.repository', () => {
    class UserRepository {
        async create(user: Omit<TestUser, 'id'>) {
            const createdUser = {
                ...user,
                id: nextUserId++,
            }

            users.set(createdUser.username, createdUser)

            return createdUser
        }

        async findByUsername(username: string) {
            return users.get(username)
        }

        async update(id: number, user: Partial<TestUser>) {
            const currentUser = Array.from(users.values()).find((item) => item.id === id)

            if (!currentUser) {
                return null
            }

            const updatedUser = {
                ...currentUser,
                ...user,
            }

            users.set(updatedUser.username, updatedUser)

            if (updatedUser.username !== currentUser.username) {
                users.delete(currentUser.username)
            }

            return updatedUser
        }
    }

    return { UserRepository }
})

export const testUserCredentials = {
    username: 'teste-user',
    password: 'teste123',
    permission: 'admin',
}

export function resetTestUsers() {
    users.clear()
    nextUserId = 1
}

export async function seedTestUser() {
    const hashedPassword = await hash(testUserCredentials.password, 8)
    const existingUser = users.get(testUserCredentials.username)

    if (existingUser) {
        users.set(testUserCredentials.username, {
            ...existingUser,
            password: hashedPassword,
            permission: testUserCredentials.permission,
        })

        return
    }

    users.set(testUserCredentials.username, {
        id: nextUserId++,
        username: testUserCredentials.username,
        password: hashedPassword,
        permission: testUserCredentials.permission,
    })
}

async function signInTestUser(app: FastifyInstance) {
    const response = await app.inject({
        method: 'POST',
        url: '/user/signin',
        payload: {
            username: testUserCredentials.username,
            password: testUserCredentials.password,
        },
    })

    if (response.statusCode !== 200) {
        throw new Error(`Falha ao autenticar usuário de teste: ${response.payload}`)
    }

    const { token } = response.json() as { token: string }

    return token
}

export async function createAuthenticatedTestApp(registerRoutes: (app: FastifyInstance) => Promise<void> | void) {
    resetTestUsers()
    await seedTestUser()

    const app = fastify()

    const { signin } = await import('@/http/controllers/user/signin')

    await app.register(fastifyJwt, {
        secret: 'test-jwt-secret',
    })

    app.addHook('onRequest', validateJwt)
    app.post('/user/signin', signin)

    await registerRoutes(app)
    await app.ready()

    const token = await signInTestUser(app)

    return {
        app,
        token,
        headers: {
            authorization: `Bearer ${token}`,
        },
    }
}