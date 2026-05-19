import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.nombre,
      registerDto.apellido,
      registerDto.dni,
      registerDto.email,
      registerDto.password,
      registerDto.rol,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
    //Devolvemos el token JWT y la información del usuario (nombre, email y rol) 
    //para que el frontend pueda usarla para mostrar la información del usuario y 
    //controlar el acceso a las rutas protegidas según el rol del usuario.
  }
}