import { create } from './create'
import { fetch } from './fetch'
import { get } from './get'
import { search } from './search'
import { update } from './update'
import { remove } from './delete'
import { authorizeRoles } from '@/http/middlewares/authorize-roles'
import { createAuthenticatedTestApp } from '@/test/helpers/authenticated-test-app'
import { jest } from '@jest/globals'

const mockHandler = jest.fn() as jest.MockedFunction<(post: any) => Promise<any>>
const mockFetchHandler = jest.fn() as jest.MockedFunction<() => Promise<any[]>>
const mockGetHandler = jest.fn() as jest.MockedFunction<(id: number) => Promise<any>>
const mockSearchHandler = jest.fn() as jest.MockedFunction<(query: string) => Promise<any>>
const mockUpdateHandler = jest.fn() as jest.MockedFunction<
    (id: number, post: any) => Promise<any>
>
const mockDeleteHandler = jest.fn() as jest.MockedFunction<(id: number) => Promise<any>>

jest.mock('@/use-cases/factory/make-create-post-use-case', () => ({
    makeCreatePostUseCase: jest.fn(() => ({
        handler: mockHandler,
    })),
}))

jest.mock('@/use-cases/factory/make-fetch-posts-use-case', () => ({
    makeFetchPostsUseCase: jest.fn(() => ({
        handler: mockFetchHandler,
    })),
}))

jest.mock('@/use-cases/factory/make-get-post-use-case', () => ({
    makeGetPostUseCase: jest.fn(() => ({
        handler: mockGetHandler,
    })),
}))

jest.mock('@/use-cases/factory/make-search-posts-use-case', () => ({
    makeSearchPostsUseCase: jest.fn(() => ({
        handler: mockSearchHandler,
    })),
}))

jest.mock('@/use-cases/factory/make-update-post-use-case', () => ({
    makeUpdatePostUseCase: jest.fn(() => ({
        handler: mockUpdateHandler,
    })),
}))

jest.mock('@/use-cases/factory/make-delete-post-use-case', () => ({
    makeDeletePostUseCase: jest.fn(() => ({
        handler: mockDeleteHandler,
    })),
}))

describe('POST /post', () => {
    let mockMakeCreatePostUseCase: jest.Mock
    let mockMakeFetchPostsUseCase: jest.Mock
    let mockMakeGetPostUseCase: jest.Mock
    let mockMakeSearchPostsUseCase: jest.Mock
    let mockMakeUpdatePostUseCase: jest.Mock
    let mockMakeDeletePostUseCase: jest.Mock
    let app: Awaited<ReturnType<typeof createAuthenticatedTestApp>>['app']
    let headers: Awaited<ReturnType<typeof createAuthenticatedTestApp>>['headers']

    beforeAll(async () => {
        const mockedCreateModule = await import('@/use-cases/factory/make-create-post-use-case')
        const mockedFetchModule = await import('@/use-cases/factory/make-fetch-posts-use-case')
        const mockedGetModule = await import('@/use-cases/factory/make-get-post-use-case')
        const mockedSearchModule = await import('@/use-cases/factory/make-search-posts-use-case')
        const mockedUpdateModule = await import('@/use-cases/factory/make-update-post-use-case')
        const mockedDeleteModule = await import('@/use-cases/factory/make-delete-post-use-case')

        mockMakeCreatePostUseCase = mockedCreateModule.makeCreatePostUseCase as jest.Mock
        mockMakeFetchPostsUseCase = mockedFetchModule.makeFetchPostsUseCase as jest.Mock
        mockMakeGetPostUseCase = mockedGetModule.makeGetPostUseCase as jest.Mock
        mockMakeSearchPostsUseCase = mockedSearchModule.makeSearchPostsUseCase as jest.Mock
        mockMakeUpdatePostUseCase = mockedUpdateModule.makeUpdatePostUseCase as jest.Mock
        mockMakeDeletePostUseCase = mockedDeleteModule.makeDeletePostUseCase as jest.Mock

        const testApp = await createAuthenticatedTestApp(async (appInstance) => {
            appInstance.post('/post', { preHandler: authorizeRoles(['admin', 'professor']) }, create)
            appInstance.get('/post', { preHandler: authorizeRoles(['admin', 'professor', 'aluno']) }, fetch)
            appInstance.get('/post/:id', { preHandler: authorizeRoles(['admin', 'professor', 'aluno']) }, get)
            appInstance.get('/post/search', { preHandler: authorizeRoles(['admin', 'professor']) }, search)
            appInstance.put('/post/:id', { preHandler: authorizeRoles(['admin', 'professor']) }, update)
            appInstance.delete('/post/:id', { preHandler: authorizeRoles(['admin', 'professor']) }, remove)
        })

        app = testApp.app
        headers = testApp.headers
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        mockHandler.mockReset()
        mockFetchHandler.mockReset()
        mockGetHandler.mockReset()
        mockSearchHandler.mockReset()
        mockUpdateHandler.mockReset()
        mockDeleteHandler.mockReset()
        mockMakeCreatePostUseCase.mockClear()
        mockMakeFetchPostsUseCase.mockClear()
        mockMakeGetPostUseCase.mockClear()
        mockMakeSearchPostsUseCase.mockClear()
        mockMakeUpdatePostUseCase.mockClear()
        mockMakeDeletePostUseCase.mockClear()
    })

    it('creates a post', async () => {
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

    it('fetches posts', async () => {
        const posts = [
            {
                id: 1,
                user_id: 7,
                title: 'Primeiro post',
                slug: 'primeiro-post',
                content: 'Conteúdo do primeiro post',
                image_url: null,
                status: 'draft',
                categories: [],
            },
        ]

        mockFetchHandler.mockResolvedValueOnce(posts)

        const response = await app.inject({
            method: 'GET',
            url: '/post',
            headers,
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.payload)).toEqual(posts)
        expect(mockMakeFetchPostsUseCase).toHaveBeenCalledTimes(1)
        expect(mockFetchHandler).toHaveBeenCalledTimes(1)
    })

    it('gets a post by id', async () => {
        const post = {
            id: 1,
            user_id: 7,
            title: 'Post único',
            slug: 'post-unico',
            content: 'Conteúdo do post único',
            image_url: null,
            status: 'draft',
            categories: [],
        }

        mockGetHandler.mockResolvedValueOnce(post)

        const response = await app.inject({
            method: 'GET',
            url: '/post/1',
            headers,
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.payload)).toEqual(post)
        expect(mockMakeGetPostUseCase).toHaveBeenCalledTimes(1)
        expect(mockGetHandler).toHaveBeenCalledWith(1)
    })

    it('searches posts', async () => {
        const posts = [
            {
                id: 2,
                user_id: 7,
                title: 'Post sobre testes',
                slug: 'post-sobre-testes',
                content: 'Conteúdo de busca',
                image_url: null,
                status: 'published',
                categories: [],
            },
        ]

        mockSearchHandler.mockResolvedValueOnce(posts)

        const response = await app.inject({
            method: 'GET',
            url: '/post/search?q=testes',
            headers,
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.payload)).toEqual(posts)
        expect(mockMakeSearchPostsUseCase).toHaveBeenCalledTimes(1)
        expect(mockSearchHandler).toHaveBeenCalledWith('testes')
    })

    it('updates a post', async () => {
        const updatedPost = {
            id: 1,
            user_id: 7,
            title: 'Post atualizado',
            slug: 'post-atualizado',
            content: 'Conteúdo atualizado do post',
            image_url: 'https://example.com/post.png',
            status: 'published',
            categories: [],
        }

        mockUpdateHandler.mockResolvedValueOnce(updatedPost)

        const response = await app.inject({
            method: 'PUT',
            url: '/post/1',
            headers,
            payload: {
                title: 'Post atualizado',
                slug: 'post-atualizado',
                content: 'Conteúdo atualizado do post',
                image_url: 'https://example.com/post.png',
                status: 'published',
            },
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.payload)).toEqual(updatedPost)
        expect(mockMakeUpdatePostUseCase).toHaveBeenCalledTimes(1)
        expect(mockUpdateHandler).toHaveBeenCalledWith(1, {
            title: 'Post atualizado',
            slug: 'post-atualizado',
            content: 'Conteúdo atualizado do post',
            image_url: 'https://example.com/post.png',
            status: 'published',
        })
    })

    it('deletes a post', async () => {
        mockDeleteHandler.mockResolvedValueOnce(true)

        const response = await app.inject({
            method: 'DELETE',
            url: '/post/1',
            headers,
        })

        expect(response.statusCode).toBe(204)
        expect(response.payload).toBe('')
        expect(mockMakeDeletePostUseCase).toHaveBeenCalledTimes(1)
        expect(mockDeleteHandler).toHaveBeenCalledWith(1)
    })
})