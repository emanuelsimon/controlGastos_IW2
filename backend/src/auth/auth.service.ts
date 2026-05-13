import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

//Esta función se encarga de manejar la lógica de autenticación, incluyendo el registro de nuevos usuarios y el inicio de sesión.
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // El método register primero verifica si el email ya está registrado, si es así, lanza una excepción de conflicto. 
  // Luego, genera un hash de la contraseña utilizando bcrypt y crea un nuevo usuario en la base de datos. Finalmente, devuelve un mensaje de éxito.
  async register(nombre: string, apellido: string, dni: string, email: string, password: string, rol: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      nombre, apellido, dni, email,
      password: hashedPassword,
      rol,
    });

    return { message: 'Usuario registrado correctamente' };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.nombre,
        email: user.email,
        rol: user.rol,
      }
    };
  }
}