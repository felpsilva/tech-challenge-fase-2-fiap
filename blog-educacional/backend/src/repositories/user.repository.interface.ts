import { IUser } from '@/entities/models/user.interface';

export interface IUserRepository {
    create(user: IUser): Promise<IUser | undefined>
    findAll(): Promise<IUser[]>
    findById(id: number): Promise<IUser | undefined>
    findByUsername(username: string): Promise<IUser | undefined>
    update(id: number, user: Partial<IUser>): Promise<IUser | undefined>
    delete(id: number): Promise<boolean>
}