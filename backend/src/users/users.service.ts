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

  //Con este método create le decimos a Nest que queremos crear un nuevo usuario en la base de datos,
  // esto nos va a servir para el proceso de registro de usuarios, para guardar los datos del nuevo usuario en la base de datos
  // Partial<User> significa que el objeto userData puede tener algunas de las propiedades de User, pero no es obligatorio que tenga todas, 
  // esto nos permite ser flexibles al crear un nuevo usuario, ya que no siempre vamos a tener todos los datos disponibles
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  //Con este método findByEmail le decimos a Nest que queremos buscar un usuario por su email,
  // esto nos va a servir para el proceso de autenticación, para verificar si el email existe en la base de datos
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
