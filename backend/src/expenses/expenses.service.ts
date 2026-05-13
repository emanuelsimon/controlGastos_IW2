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
  ) {}

  //Con este método create le decimos a Nest que queremos crear un nuevo gasto en la base de datos,
  // esto nos va a servir para el proceso de registro de gastos, para guardar los datos del nuevo gasto en la base de datos
  // Partial<Expense> significa que el objeto expenseData puede tener algunas de las propiedades de Expense, 
  // pero no es obligatorio que tenga todas, esto nos permite ser flexibles al crear un nuevo gasto, 
  // ya que no siempre vamos a tener todos los datos disponibles
  async create(expenseData: Partial<Expense>): Promise<Expense> {
    const expense = this.expensesRepository.create(expenseData);
    return this.expensesRepository.save(expense);
  }

  // Obtener todos los gastos de un usuario específico con paginado
 async findByUser(userId: number, page: number = 1, limit: number = 15): Promise<{ data: Expense[], total: number }> {
    const [data, total] = await this.expensesRepository.findAndCount({
        where: { user: { id: userId } },
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
}
