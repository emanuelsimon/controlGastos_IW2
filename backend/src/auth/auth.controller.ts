import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

  // Inyectamos el servicio de autenticación para poder usar sus métodos en el controlador 
  constructor(private authService: AuthService) {} 

  // Método que recibe un objeto RegisterDto con los datos del usuario a registrar y 
  // llama al método register del AuthService para crear el usuario y devolver el token JWT.
  @Post('register')
  async register(@Body() registerDto: RegisterDto)
  {
    return this.authService.register(registerDto);
  }

  //Devuelve el token JWT y la información del usuario (nombre, email y rol)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);  
  }
}