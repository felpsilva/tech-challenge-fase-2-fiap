import { ICategory } from './category.interface'

export interface IPost {
    id?: number | undefined
    user_id: number
    title: string
    slug: string
    content: string
    image_url?: string | undefined
    status: string
    created_at?: Date
    updated_at?: Date 
    categories?: ICategory[] | undefined
}