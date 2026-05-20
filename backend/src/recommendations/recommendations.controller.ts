import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
    constructor(private service: RecommendationsService) {}

    @Post()
    async create(@Body() body: { mensaje: string, asesorId: number, usuarioId: number }) {
        return this.service.create(body.mensaje, body.asesorId, body.usuarioId)
    }

    @Get()
    async getByUsuario(@Query('userId') userId: number) {
        return this.service.findByUsuario(userId)
    }
}