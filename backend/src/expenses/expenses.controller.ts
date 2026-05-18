import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense } from './expense.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) { }

  // GET /expenses?page=1 → gastos del usuario logueado
  @Get()
  async getMyExpenses(
    @Query('page') page: number = 1,
    @Query('userId') userId: number,
  ) {
    return this.expensesService.findByUser(userId, page)
  }

  // GET /expenses/all?page=1 → todos los gastos (asesor)
  @Get('all')
  async getAllExpenses(@Query('page') page: number = 1) {
    return this.expensesService.findAll(page)
  }

  // POST /expenses → crear un gasto
  @Post()
  async create(@Body() body: {
    comercio: string
    fecha: Date
    monto: number
    categoria: string
    descripcion?: string
    imagen?: string
    userId: number
  }) {
    return this.expensesService.create({
      comercio: body.comercio,
      fecha: body.fecha,
      monto: body.monto,
      categoria: body.categoria,
      descripcion: body.descripcion,
      imagen: body.imagen,
      user: { id: body.userId } as any
    })
  }

  @Get('reportes/categorias')
  async getReportesCategorias(@Query('userId') userId: number) {
    return this.expensesService.getReportesCategorias(userId)
  }

  @Get('reportes/meses')
  async getReportesMeses(@Query('userId') userId: number) {
    return this.expensesService.getReportesMeses(userId)
  }

  @Get('reportes/comercios')
  async getReportesComercios(@Query('userId') userId: number) {
    return this.expensesService.getReportesComercios(userId)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<Expense>) {
    return this.expensesService.update(id, body)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.expensesService.remove(id)
    return { message: 'Gasto eliminado correctamente' }
  }
}