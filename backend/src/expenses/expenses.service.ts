import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    //Con el decorador @InjectRepository(Expense) NestJS identifica la posible inyeccion de dependencias 
    // del repositorio, permitiendo hacer consultas a la base de datos para obtener, crear, actualizar o eliminar gastos
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) { }

  // Usa una promesa para manejar la creación de un nuevo gasto en la base de datos, retornando el gasto creado.
  // Partial porque no se requiere que todos los campos de Expense estén presentes, solo los necesarios para crear un nuevo gasto.
  async create(expenseData: Partial<Expense>): Promise<Expense> { 
    const expense = this.expensesRepository.create(expenseData);
    return this.expensesRepository.save(expense);
  }

  // Retorna gastos y total de un usuario en particular con paginacion
  //Equivalencia SQL: SELECT * FROM expenses WHERE userId = ? ORDER BY fecha DESC LIMIT ? OFFSET ?
  async findByUser(userId: number, page: number = 1, limit: number = 15): Promise<{ data: Expense[], total: number }> {
    const [data, total] = await this.expensesRepository.findAndCount({
      where: { user: { id: userId } as any },
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit, // Calcular el número de registros a omitir según la página y el límite
      take: limit,
    })
    return { data, total }
  }

  // Obtener todos los gastos (para el asesor)
  //Equivalencia SQL: SELECT * FROM expenses ORDER BY fecha DESC LIMIT ? OFFSET ?
  async findAll(page: number = 1, limit: number = 15): Promise<{ data: Expense[], total: number }> {
    const [data, total] = await this.expensesRepository.findAndCount({
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user']
    })
    return { data, total }
  }

  // Obtener reporte de gastos por categorías
  //Equivalencia SQL: SELECT categoria, SUM(monto) as total FROM expenses WHERE userId = ? GROUP BY categoria
  async getReportesCategorias(userId: number) {
    const expenses = await this.expensesRepository.find({ //Equivalencia SQL: SELECT * FROM expenses WHERE userId = ?
      where: { user: { id: userId } as any }
    })

    //Por cada gasto, creamos un objeto agrupado donde las claves son las categorias y los valores son la suma de los montos de cada categoria. 
    // Se inicializa como un objeto vacío.
    const agrupado: { [key: string]: number } = {} //Objeto de clave String y valor Number, para almacenar la suma de los montos por categoria
    expenses.forEach(e => {
      agrupado[e.categoria] = (agrupado[e.categoria] || 0) + Number(e.monto) //Equivalente a categoria["Comida"] = categoria["Comida"] + 1
      //Equivalencia SQL: SELECT categoria, SUM(monto) as total FROM expenses WHERE userId = ? GROUP BY categoria
    })

    return {
      labels: Object.keys(agrupado),
      datos: Object.values(agrupado)
    }
  }

  // Obtener reporte de gastos por meses
  //Equivalencia SQL: SELECT DATE_FORMAT(fecha, '%Y-%m') as mes, SUM(monto) as total FROM expenses WHERE userId = ? GROUP BY mes
  async getReportesMeses(userId: number) {
    const expenses = await this.expensesRepository.find({
      where: { user: { id: userId } as any },
      order: { fecha: 'ASC' }
    })

    //Se crea un objeto agrupado donde las claves son los meses y los valores son la suma de los 
    // montos de cada mes. Se inicializa como un objeto vacío.
    const agrupado: { [key: string]: number } = {} //Objeto de clave String y valor Number, para almacenar la suma de los montos por mes
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
    return this.expensesRepository.findOne({ where: { id }, relations: ['user'] }) as Promise<Expense>
  }

  async findById(id: number): Promise<Expense> {
    return this.expensesRepository.findOne({ where: { id }, relations: ['user'] }) as Promise<Expense>
  }

  async remove(id: number): Promise<void> {
    await this.expensesRepository.delete(id)
  }

}
