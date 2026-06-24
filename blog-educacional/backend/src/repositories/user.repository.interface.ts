import { IUser } from '@/entities/models/user.interface';

export interface IUserRepository {
    create(user: IUser): Promise<IUser | undefined>
    findAll(): Promise<IUser[]>
    findById(id: number): Promise<IUser | null>
    update(id: number, user: Partial<IUser>): Promise<IUser | null>
    delete(id: number): Promise<boolean>
}