import { Controller, Get, Query, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users?page=1 → todos los usuarios (solo para asesores)
  @Get()
  @Roles('asesor')
  async getAllUsers(
    @Query('page') page: number = 1
  ) {
    return this.usersService.findAll(page)
  }

  @Get(':id')
  async getUserById(
    @Request() req: any,
    @Param('id') id: number
  ) {
    // Solo asesores o el mismo usuario pueden ver su perfil
    if (req.user.rol !== 'asesor' && req.user.userId !== id) {
      throw new ForbiddenException('No tienes permiso para acceder a este perfil');
    }
    return this.usersService.findById(id)
  }
}