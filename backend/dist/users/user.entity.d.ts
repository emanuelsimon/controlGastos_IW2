import { Expense } from '../expenses/expense.entity';
export declare class User {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    password: string;
    rol: string;
    expenses: Expense;
}
