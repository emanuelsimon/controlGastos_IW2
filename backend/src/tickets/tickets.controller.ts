import { Controller, Post, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    @Post('upload')
    async procesarTicket(@Body() body: { image: string, mimeType?: string }) {
        //return this.ticketsService.procesarTicket(body.image, body.mimeType)
        return this.ticketsService.procesarTicket(body.image)
    }
}