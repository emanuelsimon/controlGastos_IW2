# Role-Based Access Control (RBAC)

## Descripción General

El sistema de RBAC está basado en decoradores y guards de NestJS que permiten proteger endpoints basándose en roles de usuario.

## Componentes

### 1. JwtAuthGuard
- **Ubicación:** `auth/jwt.guard.ts`
- **Función:** Verifica que el usuario esté autenticado con un JWT válido
- **Uso:** Se aplica a nivel de controlador o método

### 2. RolesGuard
- **Ubicación:** `auth/roles.guard.ts`
- **Función:** Verifica que el usuario tenga uno de los roles requeridos
- **Uso:** Se aplica junto con el decorador `@Roles()`

### 3. Decoradores

#### @Roles('rol1', 'rol2', ...)
- **Ubicación:** `auth/roles.decorator.ts`
- **Función:** Define los roles permitidos para un endpoint
- **Ejemplo:**
```typescript
@Get('admin')
@Roles('asesor')
async getAdminData() {
  // Solo accesible para asesores
}
```

#### @CurrentUser()
- **Ubicación:** `auth/current-user.decorator.ts`
- **Función:** Inyecta el usuario actual en los parámetros del método
- **Ejemplo:**
```typescript
async create(@CurrentUser() user: any, @Body() data: any) {
  console.log(user.userId, user.rol); // { userId: 1, email: 'user@email.com', rol: 'usuario' }
}
```

## Flujo de Autenticación

```
1. Cliente envía credentials → POST /auth/login
2. Backend valida y devuelve JWT token
3. Cliente almacena token en localStorage
4. Cliente envía token en header: Authorization: Bearer <token>
5. JwtAuthGuard valida el token
6. JwtStrategy decodifica y extrae el usuario
7. RolesGuard verifica si el usuario tiene los roles requeridos
8. Método del controller se ejecuta con el usuario autenticado
```

## Roles en el Sistema

### usuario
- Puede ver y gestionar sus propios gastos
- Puede procesar tickets
- NO puede ver lista de usuarios
- NO puede ver gastos de otros usuarios

### asesor
- Puede ver lista de todos los usuarios
- Puede ver gastos de cualquier usuario
- Puede crear/actualizar/eliminar gastos de cualquier usuario
- Acceso total al sistema

## Ejemplos de Uso

### Proteger un endpoint para asesores solamente
```typescript
@Get('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('asesor')
async getAdminDashboard() {
  return { message: 'Solo asesores pueden ver esto' }
}
```

### Obtener el usuario actual
```typescript
@Post('gastos')
@UseGuards(JwtAuthGuard)
async createGasto(@CurrentUser() user: any, @Body() data: any) {
  console.log(`Usuario ${user.email} creando gasto`);
  // user = { userId: 1, email: 'user@email.com', rol: 'usuario' }
}
```

### Validación de propietario + asesor
```typescript
@Put('gastos/:id')
@UseGuards(JwtAuthGuard)
async updateGasto(
  @CurrentUser() user: any,
  @Param('id') id: number,
  @Body() data: any
) {
  const expense = await this.expensesService.findById(id);
  
  // Solo asesor o propietario puede actualizar
  if (user.rol !== 'asesor' && user.userId !== expense.user.id) {
    throw new ForbiddenException('No tienes permiso');
  }
  
  return this.expensesService.update(id, data);
}
```

## Estructura de Tokens JWT

El JWT contiene la siguiente información:
```json
{
  "sub": 1,
  "email": "user@example.com",
  "rol": "usuario",
  "iat": 1234567890,
  "exp": 1234654290
}
```

Decodificado por JwtStrategy a:
```typescript
{
  userId: 1,
  email: "user@example.com",
  rol: "usuario"
}
```

## Endpoints Protegidos

| Método | Ruta | Protección | Descripción |
|--------|------|-----------|-------------|
| GET | /users | JwtAuthGuard + @Roles('asesor') | Ver lista de usuarios |
| GET | /users/:id | JwtAuthGuard | Ver perfil de usuario |
| GET | /expenses | JwtAuthGuard | Ver gastos propios |
| GET | /expenses/all | JwtAuthGuard + @Roles('asesor') | Ver todos los gastos |
| POST | /expenses | JwtAuthGuard | Crear gasto propio |
| PUT | /expenses/:id | JwtAuthGuard | Actualizar gasto propio |
| DELETE | /expenses/:id | JwtAuthGuard | Eliminar gasto propio |
| POST | /tickets/upload | JwtAuthGuard | Procesar ticket |

## Seguridad

- Los tokens JWT tienen expiración de 24 horas
- Las contraseñas se hashean con bcrypt (10 rounds)
- Las rutas protegidas requieren token válido
- Los roles se validan en cada request
- Las propiedades de recursos se verifican antes de permitir acceso
