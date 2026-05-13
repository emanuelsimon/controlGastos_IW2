import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

//Con el decorador @Injectable() le decimos a Nest que esta clase es un servicio,
// y que puede ser inyectada en otros lugares de la aplicación, como en el controlador de usuarios
@Injectable()
export class UsersService {
  constructor(
    //Con el decorador @InjectRepository(User) le decimos a Nest que queremos inyectar el repositorio de User,
    // esto nos permite hacer consultas a la base de datos para obtener, crear, actualizar o eliminar usuarios
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //Create: Método encargado de crear un nuevo usuario en la base de datos, utilizando el repositorio de User que hemos inyectado, devolviendo 
  // el usuario creado como resultado
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  //FindByEmail: Método encargado de buscar un usuario por su email,
  // esto nos va a servir para el proceso de autenticación, para verificar si el email existe en la base de datos
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  //FindAll: Método encargado de obtener todos los usuarios de la base de datos, con paginación, 
  // ordenados por apellido de forma ascendente, y devolviendo solo algunos campos del usuario para no exponer información sensible como la contraseña
  async findAll(page: number = 1, limit: number = 15): Promise<{ data: User[], total: number }> {
    const [data, total] = await this.usersRepository.findAndCount({
        order: { apellido: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
        select: ['id', 'nombre', 'apellido', 'dni', 'email', 'rol']
    })
    return { data, total }
}

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ 
        where: { id },
        select: ['id', 'nombre', 'apellido', 'dni', 'email', 'rol']
    })
}

}
