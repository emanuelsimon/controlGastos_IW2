import { User } from '../users/user.entity';
export declare class Expense {
    id: number;
    comercio: string;
    fecha: Date;
    monto: number;
    categoria: string;
    descripcion: string;
    user: User;
}
