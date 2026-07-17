export declare class CreateExpenseDto {
    comercio: string;
    fecha: string;
    monto: number;
    categoria: string;
    descripcion?: string;
    userId: number;
}
export declare class UpdateExpenseDto {
    comercio?: string;
    fecha?: string;
    monto?: number;
    categoria?: string;
    descripcion?: string;
}
