import { TicketsService } from './tickets.service';
import { ProcessTicketDto } from './dto/ticket.dto';
export declare class TicketsController {
    private ticketsService;
    constructor(ticketsService: TicketsService);
    procesarTicket(processTicketDto: ProcessTicketDto): Promise<{
        texto: any;
        comercio: string | null;
        monto: number | null;
        fecha: string | null;
        categoria: string;
    }>;
}
