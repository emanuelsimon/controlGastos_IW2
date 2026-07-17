import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(page?: number, limit?: number): Promise<{
        data: User[];
        total: number;
    }>;
    findById(id: number): Promise<User | null>;
    updateProfile(id: number, data: Partial<User>): Promise<User>;
}
