import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ProcessTicketDto } from './dto/ticket.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    @Post('upload')
    async procesarTicket(@Body() processTicketDto: ProcessTicketDto) {
        //return this.ticketsService.procesarTicket(processTicketDto.image, processTicketDto.mimeType)
        return this.ticketsService.procesarTicket(processTicketDto.image)
    }
}