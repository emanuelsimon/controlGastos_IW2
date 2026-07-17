import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(nombre: string, apellido: string, dni: string, email: string, password: string, rol: string): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: number;
            name: string;
            surname: string;
            email: string;
            rol: string;
        };
    }>;
}
