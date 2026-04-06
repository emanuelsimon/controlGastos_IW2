import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    password: string;
    rol: string;
  }) {
    return this.authService.register(
      body.nombre,
      body.apellido,
      body.dni,
      body.email,
      body.password,
      body.rol,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
    //Devolvemos el token JWT y la información del usuario (nombre, email y rol) 
    //para que el frontend pueda usarla para mostrar la información del usuario y 
    //controlar el acceso a las rutas protegidas según el rol del usuario.
  }
}