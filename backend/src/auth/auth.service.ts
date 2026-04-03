import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';//Porque * as bcrypt? 
// Porque bcrypt no tiene una exportación por defecto, sino que exporta varias funciones, 
// por eso usamos el comodín * para importar todas las funciones de bcrypt y luego las usamos con el prefijo bcrypt. 
// Por ejemplo, bcrypt.hash() para hashear una contraseña y bcrypt.compare() para comparar una contraseña con un hash.

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(nombre: string, apellido: string, dni: string, email: string, password: string, rol: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    //bcrypt.hash(password, 10) genera un hash de la contraseña utilizando el algoritmo bcrypt, 
    // con una sal de 10 rondas. Esto significa que el proceso de hash se repetirá 10 veces, 
    // lo que hace que el hash sea más seguro pero también más lento de generar. Seguro contra 
    // ataques de fuerza bruta, ya que aumenta el tiempo necesario para generar cada hash, lo que 
    // dificulta a los atacantes probar muchas contraseñas en un corto período de tiempo.
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
        name: user.nombre,
        email: user.email,
        rol: user.rol,
      }
    };
  }
}