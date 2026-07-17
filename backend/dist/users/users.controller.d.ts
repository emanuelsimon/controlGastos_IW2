import { UsersService } from './users.service';
import { User } from './user.entity';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers(page?: number): Promise<{
        data: User[];
        total: number;
    }>;
    getUserById(req: any, id: number): Promise<User | null>;
    updateProfile(user: any, id: number, body: Partial<User>): Promise<User>;
}
