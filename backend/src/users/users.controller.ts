import { Controller, Get, Query, Param, UseGuards, Request, ForbiddenException, Put, Body, UnauthorizedException } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

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

  @Put(':id')
  async updateProfile(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() body: Partial<User>
  ) {
    // Solo el propio usuario o un asesor pueden actualizar el perfil
    if (user.rol !== 'asesor' && user.userId !== Number(id)) {
      throw new ForbiddenException('No tenés permiso para modificar este perfil')
    }
    return this.usersService.updateProfile(id, body)
  }
}