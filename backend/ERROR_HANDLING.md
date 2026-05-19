# Error Handling - Manejo de Errores

## Descripción General

El sistema implementa un manejo centralizado de errores mediante:
1. **Global Exception Filter** - Captura todas las excepciones
2. **Logging Middleware** - Registra todas las requests HTTP
3. **StandardizedErrorResponses** - Formato consistente de errores

## Architecture

```
Request
  ↓
LoggerMiddleware (registra request)
  ↓
Controller/Service
  ↓
¿Excepción?
  ├─ Sí → AllExceptionsFilter (formatea error) → Respuesta estandarizada
  └─ No → Respuesta normal
```

## Global Exception Filter

Ubicación: `src/common/filters/all-exceptions.filter.ts`

### Características:
- Captura TODAS las excepciones
- Convierte a formato JSON estándar
- Registra en logs
- Incluye timestamp, path, método HTTP

### Respuesta de Error Estándar

```json
{
  "statusCode": 400,
  "timestamp": "2026-05-19T14:30:00.000Z",
  "path": "/auth/login",
  "method": "POST",
  "message": "Email must be an email",
  "errors": null
}
```

### Campos:
- **statusCode**: Código HTTP (400, 401, 403, 500, etc)
- **timestamp**: ISO 8601 timestamp
- **path**: Ruta de la request
- **method**: Método HTTP (GET, POST, etc)
- **message**: Mensaje de error legible
- **errors**: Array de errores detallados (si aplica)

## Logger Middleware

Ubicación: `src/common/middleware/logger.middleware.ts`

### Funcionalidad:
- Registra todas las requests HTTP
- Muestra método, ruta, status code y duración
- Usa colores en logs (verde para 2xx, rojo para 4xx/5xx)

### Ejemplo de Log:
```
[HTTP] GET /expenses 200 - 45ms
[HTTP] POST /auth/login 401 - 120ms
[HTTP] DELETE /expenses/999 500 - 85ms
```

## Tipos de Excepciones

### 400 Bad Request
Se lanza cuando hay validación inválida.

```typescript
// Ejemplo: Email inválido
{
  "statusCode": 400,
  "message": "email must be an email",
  "timestamp": "2026-05-19T14:30:00.000Z",
  "path": "/auth/login",
  "method": "POST"
}
```

### 401 Unauthorized
Se lanza cuando falta token JWT o es inválido.

```typescript
throw new UnauthorizedException('Token inválido o expirado');

// Respuesta:
{
  "statusCode": 401,
  "message": "Token inválido o expirado",
  "timestamp": "...",
  "path": "/expenses",
  "method": "GET"
}
```

### 403 Forbidden
Se lanza cuando el usuario no tiene permisos.

```typescript
throw new ForbiddenException('No tienes permiso para acceder a este recurso');

// Respuesta:
{
  "statusCode": 403,
  "message": "No tienes permiso para acceder a este recurso",
  "timestamp": "...",
  "path": "/users",
  "method": "GET"
}
```

### 404 Not Found
Se lanza cuando un recurso no existe.

```typescript
throw new NotFoundException('Gasto no encontrado');

// Respuesta:
{
  "statusCode": 404,
  "message": "Gasto no encontrado",
  "timestamp": "...",
  "path": "/expenses/999",
  "method": "GET"
}
```

### 409 Conflict
Se lanza cuando hay un conflicto (ej: email duplicado).

```typescript
throw new ConflictException('El email ya está registrado');

// Respuesta:
{
  "statusCode": 409,
  "message": "El email ya está registrado",
  "timestamp": "...",
  "path": "/auth/register",
  "method": "POST"
}
```

### 500 Internal Server Error
Se lanza para errores no controlados.

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "timestamp": "2026-05-19T14:30:00.000Z",
  "path": "/expenses",
  "method": "GET"
}
```

## Validación de DTOs

Los errores de validación se formatean automáticamente:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "rol must be one of the following values: usuario, asesor"
  ],
  "error": "Bad Request"
}
```

## Patrones de Error en Controllers

### Patrón 1: Validar Propietario
```typescript
@Delete(':id')
async remove(@CurrentUser() user: any, @Param('id') id: number) {
  const expense = await this.expensesService.findById(id);
  
  if (!expense) {
    throw new NotFoundException('Gasto no encontrado');
  }
  
  if (user.rol !== 'asesor' && user.userId !== expense.user.id) {
    throw new ForbiddenException('No puedes eliminar este gasto');
  }
  
  await this.expensesService.remove(id);
  return { message: 'Gasto eliminado' };
}
```

### Patrón 2: Validar Rol
```typescript
@Get('admin')
@Roles('asesor')
@UseGuards(JwtAuthGuard, RolesGuard)
async getAdminData() {
  // RolesGuard lanza ForbiddenException si el rol no es 'asesor'
  return { message: 'Solo asesores' };
}
```

### Patrón 3: Validar Entrada (DTO)
```typescript
@Post()
async create(@Body() createExpenseDto: CreateExpenseDto) {
  // ValidationPipe valida automáticamente y lanza BadRequestException
  // si hay errores
  return this.expensesService.create(createExpenseDto);
}
```

## Best Practices

### 1. Usar excepciones específicas
```typescript
// ✅ Bien
throw new NotFoundException('Usuario no encontrado');
throw new ForbiddenException('No tienes permisos');
throw new ConflictException('El email ya existe');

// ❌ Evitar
throw new Error('Error genérico');
throw new HttpException('Algo fue mal', 500);
```

### 2. Mensajes descriptivos
```typescript
// ✅ Bien
throw new BadRequestException('La fecha debe estar en formato YYYY-MM-DD');

// ❌ Evitar
throw new BadRequestException('Fecha inválida');
```

### 3. Loguear errores importantes
```typescript
// Automático en AllExceptionsFilter, pero puedes loguear en servicios:
private readonly logger = new Logger(MyService.name);

try {
  // código
} catch (error) {
  this.logger.error('Error procesando ticket', error);
  throw new InternalServerErrorException('No pudimos procesar el ticket');
}
```

## Status Codes HTTP Utilizados

| Code | Nombre | Uso |
|------|--------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido/faltante |
| 403 | Forbidden | Insuficientes permisos |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Conflicto (email duplicado) |
| 500 | Server Error | Error no controlado |

## Configuración del Exception Filter

En `main.ts`:
```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

El filter automáticamente:
- Captura todas las excepciones
- Las formatea en JSON
- Las registra en logs
- Las envía al cliente

## Ejemplo: Flujo Completo de Error

### 1. Cliente intenta crear gasto sin autenticación
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"comercio":"Carrefour","fecha":"2026-05-19","monto":100,"categoria":"Alimentación","userId":1}'
```

### 2. JwtAuthGuard detecta falta de token
```typescript
throw new UnauthorizedException('Token no válido');
```

### 3. AllExceptionsFilter formatea la respuesta
```json
{
  "statusCode": 401,
  "message": "Token no válido",
  "timestamp": "2026-05-19T14:30:00.000Z",
  "path": "/expenses",
  "method": "POST"
}
```

### 4. Cliente recibe respuesta con status 401
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Token no válido",
  ...
}
```
