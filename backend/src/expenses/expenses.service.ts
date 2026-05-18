import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';

//Con el decorador @Injectable() le decimos a Nest que esta clase es un servicio,
// y que puede ser inyectada en otros lugares de la aplicación, como en el controlador de expenses
@Injectable()
export class ExpensesService {
  constructor(
    //Con el decorador @InjectRepository(Expense) le decimos a Nest que queremos inyectar el repositorio de Expense,
    // esto nos permite hacer consultas a la base de datos para obtener, crear, actualizar o eliminar gastos
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) { }


  async create(expenseData: Partial<Expense>): Promise<Expense> {
    const expense = this.expensesRepository.create(expenseData);
    return this.expensesRepository.save(expense);
  }

  // Obtener todos los gastos de un usuario específico con paginado
  async findByUser(userId: number, page: number = 1, limit: number = 15): Promise<{ data: Expense[], total: number }> {
    const [data, total] = await this.expensesRepository.findAndCount({
      where: { user: { id: userId } as any },
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total }
  }

  // Obtener todos los gastos (para el asesor)
  async findAll(page: number = 1, limit: number = 15): Promise<{ data: Expense[], total: number }> {
    const [data, total] = await this.expensesRepository.findAndCount({
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user']
    })
    return { data, total }
  }

  async getReportesCategorias(userId: number) {
    const expenses = await this.expensesRepository.find({
      where: { user: { id: userId } as any }
    })

    const agrupado: { [key: string]: number } = {}
    expenses.forEach(e => {
      agrupado[e.categoria] = (agrupado[e.categoria] || 0) + Number(e.monto)
    })

    return {
      labels: Object.keys(agrupado),
      datos: Object.values(agrupado)
    }
  }

  async getReportesMeses(userId: number) {
    const expenses = await this.expensesRepository.find({
      where: { user: { id: userId } as any },
      order: { fecha: 'ASC' }
    })

    const agrupado: { [key: string]: number } = {}
    expenses.forEach(e => {
      const fecha = new Date(e.fecha)
      const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      agrupado[clave] = (agrupado[clave] || 0) + Number(e.monto)
    })

    return {
      labels: Object.keys(agrupado),
      datos: Object.values(agrupado)
    }
  }

  async getReportesComercios(userId: number) {
    const expenses = await this.expensesRepository.find({
      where: { user: { id: userId } as any }
    })

    const agrupado: { [key: string]: number } = {}
    expenses.forEach(e => {
      agrupado[e.comercio] = (agrupado[e.comercio] || 0) + Number(e.monto)
    })

    const sorted = Object.entries(agrupado)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      labels: sorted.map(([k]) => k),
      datos: sorted.map(([, v]) => v)
    }
  }

  async update(id: number, expenseData: Partial<Expense>): Promise<Expense> {
    await this.expensesRepository.update(id, expenseData)
    return this.expensesRepository.findOne({ where: { id } }) as Promise<Expense>
  }

  async remove(id: number): Promise<void> {
    await this.expensesRepository.delete(id)
  }
}
