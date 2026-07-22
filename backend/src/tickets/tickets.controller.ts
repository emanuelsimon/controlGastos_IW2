import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ProcessTicketDto } from './dto/ticket.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    // Llamada al servicio para procesar el ticket luego de validar la imagen mediante el DTO ProcessTicketDto
    @Post('upload')
    async procesarTicket(@Body() processTicketDto: ProcessTicketDto) {
        return this.ticketsService.procesarTicket(processTicketDto.image) 
    }
}