# Database Setup - Configuración de Base de Datos

## Requisitos

- PostgreSQL 12+
- Usuario del sistema con acceso a PostgreSQL

## Estado Actual

La aplicación está configurada para:
- **Host:** localhost
- **Puerto:** 5432
- **Usuario:** ctrlgasto_user
- **Contraseña:** ctrlgasto123
- **Base de datos:** ctrlgasto

Estas credenciales están en `backend/.env`

## Instalación de PostgreSQL

### En Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### En macOS (con Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

### En Windows:
Descargar desde https://www.postgresql.org/download/windows/

## Creación de Base de Datos

### Opción 1: Automática (Script)

```bash
cd backend
bash setup-database.sh
```

Luego sigue las instrucciones en pantalla.

### Opción 2: Manual

#### Paso 1: Conectarse como postgres
```bash
sudo -u postgres psql
```

#### Paso 2: Crear usuario
```sql
CREATE USER ctrlgasto_user WITH PASSWORD 'ctrlgasto123';
ALTER ROLE ctrlgasto_user CREATEDB;
```

#### Paso 3: Crear base de datos
```sql
CREATE DATABASE ctrlgasto OWNER ctrlgasto_user;
```

#### Paso 4: Otorgar privilegios
```sql
GRANT ALL PRIVILEGES ON DATABASE ctrlgasto TO ctrlgasto_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO ctrlgasto_user;
```

#### Paso 5: Salir
```sql
\q
```

## Verificar Conexión

```bash
psql -U ctrlgasto_user -d ctrlgasto -h localhost -c "SELECT NOW();"
```

Debe mostrar la fecha y hora actual.

## Iniciar la Aplicación

```bash
cd backend
npm install
npm run start:dev
```

TypeORM sincronizará automáticamente la base de datos:
- Creará las tablas: `user` y `expense`
- Establecerá relaciones (OneToMany)

## Tablas Creadas

### user
```sql
CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  dni VARCHAR(8) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### expense
```sql
CREATE TABLE expense (
  id SERIAL PRIMARY KEY,
  comercio VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  descripcion TEXT,
  imagen LONGTEXT,
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);
```

## Troubleshooting

### Error: "could not connect to server"
```
Solución: Iniciar PostgreSQL
- Ubuntu: sudo service postgresql start
- macOS: brew services start postgresql
```

### Error: "Peer authentication failed"
```
Solución: Usar localhost en lugar de socket
psql -U ctrlgasto_user -d ctrlgasto -h localhost
```

### Error: "role does not exist"
```
Solución: Crear el usuario
sudo -u postgres psql -c "CREATE USER ctrlgasto_user WITH PASSWORD 'ctrlgasto123';"
```

### Error: "database does not exist"
```
Solución: Crear la BD
sudo -u postgres createdb -O ctrlgasto_user ctrlgasto
```

## Respaldar Base de Datos

### Crear backup
```bash
pg_dump -U ctrlgasto_user -d ctrlgasto > backup.sql
```

### Restaurar backup
```bash
psql -U ctrlgasto_user -d ctrlgasto < backup.sql
```

## Eliminar Base de Datos

### Advertencia: Esto eliminará todos los datos

```bash
# Como postgres
sudo -u postgres psql

# Dentro de psql:
DROP DATABASE ctrlgasto;
DROP USER ctrlgasto_user;
\q
```

## Variables de Entorno

Las credenciales se configuran en `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ctrlgasto_user
DB_PASSWORD=ctrlgasto123
DB_DATABASE=ctrlgasto
```

Para cambiar credenciales en producción:
1. Crear nuevo usuario/BD en PostgreSQL
2. Actualizar `.env` con nuevas credenciales
3. Reiniciar la aplicación

## Configuración de TypeORM

En `backend/src/app.module.ts`:

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // ⚠️ Poner en FALSE en PRODUCCION
  }),
})
```

## Notas Importantes

- **synchronize: true** - Sincroniza automáticamente en desarrollo
- **En PRODUCCION** - Cambiar a `synchronize: false` y usar migrations
- Las contraseñas deben ser seguras en producción
- Hacer backups regularmente

## Próximos Pasos

Una vez la BD esté funcionando:

1. ✅ Iniciar backend: `npm run start:dev`
2. ✅ Iniciar frontend: Abrir `frontend/index.html`
3. ✅ Registrar usuario
4. ✅ Crear gastos
5. ✅ Probar API

## Soporte

Si tienes problemas con PostgreSQL:
- Documentación oficial: https://www.postgresql.org/docs/
- Stack Overflow: https://stackoverflow.com/questions/tagged/postgresql
