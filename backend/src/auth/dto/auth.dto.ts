import { IsEmail, IsString, MinLength, MaxLength, IsEnum } from 'class-validator';

// DTO para el login. Aqui se definen las validaciones para los campos email y 
// password que se reciben en el login.

export class LoginDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}

// DTO para el registro, son los datos que se esperan recibir. 
// Aqui se definen las validaciones para los campos nombre, apellido, dni, email, 
// password y rol que se reciben en el registro.
// Llevan el signo "!" para indicar que son campos obligatorios y no pueden ser nulos
export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre!: string;

  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede exceder 50 caracteres' })
  apellido!: string;

  @IsString()
  @MinLength(7, { message: 'El DNI debe tener al menos 7 caracteres' })
  @MaxLength(8, { message: 'El DNI no puede exceder 8 caracteres' })
  dni!: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string; 

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsEnum(['usuario', 'asesor'], { message: 'El rol debe ser "usuario" o "asesor"' })
  rol!: string;
}
