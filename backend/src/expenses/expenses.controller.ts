import { Controller, Get, Post, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

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
}