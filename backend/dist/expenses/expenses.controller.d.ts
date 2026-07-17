import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
export declare class ExpensesController {
    private expensesService;
    constructor(expensesService: ExpensesService);
    update(user: any, id: number, updateExpenseDto: UpdateExpenseDto): Promise<import("./expense.entity").Expense>;
    remove(user: any, id: number): Promise<{
        message: string;
    }>;
    getAllExpenses(page?: number): Promise<{
        data: import("./expense.entity").Expense[];
        total: number;
    }>;
    getMyExpenses(user: any, page: number | undefined, userId: number): Promise<{
        data: import("./expense.entity").Expense[];
        total: number;
    }>;
    create(user: any, createExpenseDto: CreateExpenseDto): Promise<import("./expense.entity").Expense>;
    getReportes(user: any, userId: number): Promise<{
        categorias: {
            labels: string[];
            datos: number[];
        };
        meses: {
            labels: string[];
            datos: number[];
        };
        comercios: {
            labels: string[];
            datos: number[];
        };
    }>;
    getReportesCategorias(user: any, userId: number): Promise<{
        labels: string[];
        datos: number[];
    }>;
    getReportesMeses(user: any, userId: number): Promise<{
        labels: string[];
        datos: number[];
    }>;
    getReportesComercios(user: any, userId: number): Promise<{
        labels: string[];
        datos: number[];
    }>;
    getById(id: number): Promise<import("./expense.entity").Expense>;
}
