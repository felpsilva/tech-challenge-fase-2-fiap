import { create } from './create'
import { authorizeRoles } from '@/http/middlewares/authorize-roles'
import { createAuthenticatedTestApp } from '@/test/helpers/authenticated-test-app'
import { jest } from '@jest/globals'

const mockHandler = jest.fn() as jest.MockedFunction<(post: any) => Promise<any>>

jest.mock('@/use-cases/factory/make-create-post-use-case', () => ({
    makeCreatePostUseCase: jest.fn(() => ({
        handler: mockHandler,
    })),
}))

describe('POST /post', () => {
    let mockMakeCreatePostUseCase: jest.Mock
    let app: Awaited<ReturnType<typeof createAuthenticatedTestApp>>['app']
    let headers: Awaited<ReturnType<typeof createAuthenticatedTestApp>>['headers']

    beforeAll(async () => {
        const mockedModule = await import('@/use-cases/factory/make-create-post-use-case')
        mockMakeCreatePostUseCase = mockedModule.makeCreatePostUseCase as jest.Mock

        const testApp = await createAuthenticatedTestApp(async (appInstance) => {
            appInstance.post('/post', { preHandler: authorizeRoles(['admin', 'professor']) }, create)
        })

        app = testApp.app
        headers = testApp.headers
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        mockHandler.mockReset()
        mockMakeCreatePostUseCase.mockClear()
    })

    it('creates a post and returns 201', async () => {
        const createdPost = {
            id: 1,
            user_id: 7,
            title: 'Novo post',
            slug: 'novo-post',
            content: 'Conteúdo do post',
            image_url: null,
            status: 'draft',
            categories: [],
        }

        mockHandler.mockResolvedValueOnce(createdPost)

        const response = await app.inject({
            method: 'POST',
            url: '/post',
            headers,
            payload: {
                user_id: 7,
                title: 'Novo post',
                slug: 'novo-post',
                content: 'Conteúdo do post',
            },
        })

        expect(response.statusCode).toBe(201)
        expect(JSON.parse(response.payload)).toEqual(createdPost)
        expect(mockMakeCreatePostUseCase).toHaveBeenCalledTimes(1)
        expect(mockHandler).toHaveBeenCalledWith({
            user_id: 7,
            title: 'Novo post',
            slug: 'novo-post',
            content: 'Conteúdo do post',
            image_url: undefined,
            status: 'draft',
            categories: undefined,
        })
    })
})