import { Controller, Get, Post, Body, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('recommendations')
// Se aplican los guards de autenticación y roles a todo el controlador
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecommendationsController {
    constructor(private service: RecommendationsService) {}

    // Solo los asesores pueden crear recomendaciones
    @Post()
    @Roles('asesor')
    async create(@Body() body: { mensaje: string, asesorId: number, usuarioId: number }) {
        return this.service.create(body.mensaje, body.asesorId, body.usuarioId)
    }

    // Un usuario solo puede ver sus propias recomendaciones; el asesor puede ver las de cualquiera
    @Get()
    async getByUsuario(
        @CurrentUser() user: any,
        @Query('userId') userId: number
    ) {
        if (user.rol !== 'asesor' && user.userId !== Number(userId)) {
            throw new ForbiddenException('No tenés permiso para ver estas recomendaciones')
        }
        return this.service.findByUsuario(userId)
    }
}
