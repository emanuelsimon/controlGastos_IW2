import { Controller, Get, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users?page=1 → todos los usuarios (para el asesor)
  @Get()
  async getAllUsers(@Query('page') page: number = 1) {
    return this.usersService.findAll(page)
  }

  @Get(':id')
    async getUserById(@Param('id') id: number) {
    return this.usersService.findById(id)
    }

}