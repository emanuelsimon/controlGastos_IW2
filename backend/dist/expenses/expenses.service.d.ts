import { Repository } from 'typeorm';
import { Expense } from './expense.entity';
export declare class ExpensesService {
    private expensesRepository;
    constructor(expensesRepository: Repository<Expense>);
    create(expenseData: Partial<Expense>): Promise<Expense>;
    findByUser(userId: number, page?: number, limit?: number): Promise<{
        data: Expense[];
        total: number;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: Expense[];
        total: number;
    }>;
    getReportesCategorias(userId: number): Promise<{
        labels: string[];
        datos: number[];
    }>;
    getReportesMeses(userId: number): Promise<{
        labels: string[];
        datos: number[];
    }>;
    getReportesComercios(userId: number): Promise<{
        labels: string[];
        datos: number[];
    }>;
    update(id: number, expenseData: Partial<Expense>): Promise<Expense>;
    findById(id: number): Promise<Expense>;
    remove(id: number): Promise<void>;
}
