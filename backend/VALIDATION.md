# Data Transfer Objects (DTOs) - Validación de Datos

## Descripción General

Los DTOs son clases TypeScript que definen la estructura y validación de los datos que recibe la API. Utilizamos `class-validator` y `class-transformer` para validación automática.

## Arquitectura

```
Cliente envía datos
        ↓
ValidationPipe intercepta
        ↓
Validar contra DTO
        ↓
¿Datos válidos?
    ↙ No    ↘ Sí
Error 400    Pasar al controller
```

## DTOs Implementados

### 1. Authentication DTOs

#### LoginDto
Valida credenciales de login.

```typescript
@IsEmail() // email debe ser válido
@MinLength(6) // password mínimo 6 caracteres

// Ejemplo válido:
{
  "email": "user@example.com",
  "password": "password123"
}

// Ejemplo inválido:
{
  "email": "invalid-email", // Error: no es email válido
  "password": "123" // Error: menos de 6 caracteres
}
```

#### RegisterDto
Valida registro de nuevo usuario.

```typescript
{
  "nombre": "Juan", // 2-50 caracteres
  "apellido": "Pérez", // 2-50 caracteres
  "dni": "12345678", // 7-8 caracteres
  "email": "juan@example.com", // debe ser email válido
  "password": "password123", // mínimo 6 caracteres
  "rol": "usuario" // "usuario" o "asesor"
}
```

### 2. Expense DTOs

#### CreateExpenseDto
Valida creación de nuevo gasto.

```typescript
{
  "comercio": "Supermercado XYZ", // máximo 100 caracteres
  "fecha": "2026-05-19", // formato ISO 8601 (YYYY-MM-DD)
  "monto": 125.50, // número positivo
  "categoria": "Alimentación", // máximo 50 caracteres
  "descripcion": "Compra semanal", // opcional, máximo 500 caracteres
  "imagen": "data:image/png;base64,...", // opcional
  "userId": 1 // número entero
}
```

**Validaciones:**
- `comercio`: string, máximo 100 caracteres
- `fecha`: fecha válida en formato ISO
- `monto`: número > 0.01
- `categoria`: string, máximo 50 caracteres
- `descripcion`: string opcional, máximo 500 caracteres
- `imagen`: string opcional
- `userId`: número entero

#### UpdateExpenseDto
Valida actualización de gasto (todos los campos son opcionales).

```typescript
{
  "comercio": "Nuevo nombre", // opcional
  "monto": 200, // opcional
  "categoria": "Transporte", // opcional
  // ... otros campos opcionales
}
```

### 3. Ticket DTOs

#### ProcessTicketDto
Valida envío de imagen para procesar con OCR.

```typescript
{
  "image": "data:image/jpeg;base64,...", // imagen en base64
  "mimeType": "image/jpeg" // opcional
}
```

## Configuración Global

El `ValidationPipe` está configurado en `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Remover campos no permitidos
    forbidNonWhitelisted: true, // Error si hay campos extra
    transform: true, // Convertir tipos automáticamente
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### Opciones:
- **whitelist**: Ignora propiedades no definidas en el DTO
- **forbidNonWhitelisted**: Lanza error si hay propiedades extra
- **transform**: Convierte tipos automáticamente (ej: string "123" → number 123)
- **enableImplicitConversion**: Permite conversión automática de tipos

## Respuestas de Error

### Error de validación (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### Error de propiedad no permitida

```json
{
  "statusCode": 400,
  "message": [
    "property xyz should not exist"
  ],
  "error": "Bad Request"
}
```

## Decoradores Utilizados

### class-validator

| Decorador | Descripción | Ejemplo |
|-----------|-------------|---------|
| `@IsEmail()` | Valida formato de email | email: string |
| `@IsString()` | Valida que sea string | nombre: string |
| `@IsNumber()` | Valida que sea número | monto: number |
| `@IsEnum()` | Valida enum | rol: 'usuario' \| 'asesor' |
| `@IsDateString()` | Valida formato de fecha ISO | fecha: string |
| `@MinLength(n)` | Mínimo de caracteres | password: string |
| `@MaxLength(n)` | Máximo de caracteres | comercio: string |
| `@Min(n)` | Valor mínimo | monto: number |
| `@IsOptional()` | Campo opcional | descripcion?: string |

## Ejemplo de Flujo Completo

### 1. Cliente envía datos

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123"}'
```

### 2. NestJS recibe y valida

El `ValidationPipe` automáticamente:
- Valida contra `LoginDto`
- Comprueba `@IsEmail()` en email
- Comprueba `@MinLength(6)` en password

### 3. Si hay errores

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

### 4. Si es válido

Pasa al controller con datos tipados y seguros.

## Best Practices

1. **Siempre usar DTOs** para datos de entrada
2. **Especificar tipos precisos** (no usar `any`)
3. **Usar `@IsOptional()`** para campos opcionales
4. **Validar rangos** (min/max) para números
5. **Documentar restricciones** en comentarios
6. **Usar mensajes descriptivos** en validaciones

## Ejemplo: Crear nuevo DTO

```typescript
// expense-filter.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class FilterExpenseDto {
  @IsOptional()
  @IsEnum(['Alimentación', 'Transporte', 'Ocio'])
  categoria?: string;

  @IsOptional()
  @IsNumber()
  minMonto?: number;

  @IsOptional()
  @IsNumber()
  maxMonto?: number;
}

// En el controller:
@Get('/filtered')
async getFiltered(@Query() filterDto: FilterExpenseDto) {
  return this.expensesService.filter(filterDto);
}
```
