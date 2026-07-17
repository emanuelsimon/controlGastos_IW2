import { ConfigService } from '@nestjs/config';
export declare class TicketsService {
    private configService;
    constructor(configService: ConfigService);
    procesarTicket(base64Image: string): Promise<{
        texto: any;
        comercio: string | null;
        monto: number | null;
        fecha: string | null;
        categoria: string;
    }>;
    private extraerMonto;
    private extraerFecha;
    private extraerComercio;
    private inferirCategoria;
}
