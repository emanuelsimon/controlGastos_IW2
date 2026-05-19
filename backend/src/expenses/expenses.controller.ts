import { Controller, Get, Post, Body, Param, Query, Put, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) { }

  // GET /expenses?page=1 → gastos del usuario logueado
  @Get()
  async getMyExpenses(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('userId') userId: number,
  ) {
    // Verificar que el usuario solo pueda ver sus propios gastos (a menos que sea asesor)
    if (user.rol !== 'asesor' && user.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a estos gastos');
    }
    return this.expensesService.findByUser(userId, page)
  }

  // GET /expenses/all?page=1 → todos los gastos (asesor)
  @Get('all')
  @Roles('asesor')
  async getAllExpenses(
    @Query('page') page: number = 1
  ) {
    return this.expensesService.findAll(page)
  }

  // POST /expenses → crear un gasto
  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createExpenseDto: CreateExpenseDto
  ) {
    // Verificar que el usuario solo pueda crear gastos para sí mismo (a menos que sea asesor)
    if (user.rol !== 'asesor' && user.userId !== createExpenseDto.userId) {
      throw new ForbiddenException('No tienes permiso para crear gastos para otro usuario');
    }
    
    return this.expensesService.create({
      comercio: createExpenseDto.comercio,
      fecha: new Date(createExpenseDto.fecha),
      monto: createExpenseDto.monto,
      categoria: createExpenseDto.categoria,
      descripcion: createExpenseDto.descripcion,
      imagen: createExpenseDto.imagen,
      user: { id: createExpenseDto.userId } as any
    })
  }

  @Get('reportes/categorias')
  async getReportesCategorias(
    @CurrentUser() user: any,
    @Query('userId') userId: number
  ) {
    // Verificar permisos
    if (user.rol !== 'asesor' && user.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a estos reportes');
    }
    return this.expensesService.getReportesCategorias(userId)
  }

  @Get('reportes/meses')
  async getReportesMeses(
    @CurrentUser() user: any,
    @Query('userId') userId: number
  ) {
    // Verificar permisos
    if (user.rol !== 'asesor' && user.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a estos reportes');
    }
    return this.expensesService.getReportesMeses(userId)
  }

  @Get('reportes/comercios')
  async getReportesComercios(
    @CurrentUser() user: any,
    @Query('userId') userId: number
  ) {
    // Verificar permisos
    if (user.rol !== 'asesor' && user.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a estos reportes');
    }
    return this.expensesService.getReportesComercios(userId)
  }

  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() updateExpenseDto: UpdateExpenseDto
  ) {
    // Verificar que el usuario sea asesor o propietario del gasto
    const expense = await this.expensesService.findById(id);
    if (user.rol !== 'asesor' && user.userId !== expense.user.id) {
      throw new ForbiddenException('No tienes permiso para actualizar este gasto');
    }
    
    const updateData: any = {};
    if (updateExpenseDto.fecha) updateData.fecha = new Date(updateExpenseDto.fecha);
    if (updateExpenseDto.comercio) updateData.comercio = updateExpenseDto.comercio;
    if (updateExpenseDto.monto) updateData.monto = updateExpenseDto.monto;
    if (updateExpenseDto.categoria) updateData.categoria = updateExpenseDto.categoria;
    if (updateExpenseDto.descripcion) updateData.descripcion = updateExpenseDto.descripcion;
    if (updateExpenseDto.imagen) updateData.imagen = updateExpenseDto.imagen;
    
    return this.expensesService.update(id, updateData)
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: number
  ) {
    // Verificar que el usuario sea asesor o propietario del gasto
    const expense = await this.expensesService.findById(id);
    if (user.rol !== 'asesor' && user.userId !== expense.user.id) {
      throw new ForbiddenException('No tienes permiso para eliminar este gasto');
    }
    await this.expensesService.remove(id)
    return { message: 'Gasto eliminado correctamente' }
  }
}