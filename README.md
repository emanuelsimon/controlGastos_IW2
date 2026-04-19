# CtrlGasto 💰
Plataforma inteligente de gestión de gastos personales — Proyecto final Ingeniería Web II (UNDEF 2026)

---

## 📋 Descripción

CtrlGasto es una aplicación web que permite a los usuarios registrar y analizar sus gastos personales mediante la carga manual o por foto de ticket (con interpretación por IA). Los asesores financieros tienen un panel propio para visualizar y analizar los patrones de consumo de cada usuario.

---

## Estado actual del proyecto

### Frontend (completo)
Interfaz web desarrollada con HTML, CSS y JavaScript puro, con diseño oscuro y moderno.

**Pantallas del Usuario:**
- Login y Registro
- Dashboard con navegación por sidebar
- Historial de gastos con filtros y paginado
- Carga de gastos con drag & drop de imagen de ticket
- Reportes con gráficos (torta, barras, ranking)

**Pantallas del Asesor:**
- Panel del asesor
- Lista de usuarios con filtros y paginado
- Detalle de gastos por usuario

### ✅ Backend (parcialmente implementado)
API REST desarrollada con NestJS y PostgreSQL.

**Implementado:**
- Autenticación: `POST /auth/register` y `POST /auth/login`
- Entidad `Usuario` con TypeORM
- Generación de tokens JWT
- Hash de contraseñas con bcrypt

**Pendiente:**
- Endpoints CRUD de gastos
- Integración con IA para procesamiento de tickets
- Endpoints del asesor

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | NestJS (Node.js) |
| Base de datos | PostgreSQL |
| ORM | TypeORM |
| Autenticación | JWT + bcrypt |
| Gráficos | Chart.js |

---

## 📁 Estructura del proyecto

```
controlGastos_IW2/
├── frontend/
│   ├── index.html              ← Login
│   ├── register.html           ← Registro
│   ├── dashboard.html          ← Panel usuario
│   ├── expenses.html           ← Historial de gastos
│   ├── upload.html             ← Carga de ticket
│   ├── reports.html            ← Reportes y gráficos
│   ├── advisor/
│   │   ├── dashboard.html      ← Panel asesor
│   │   ├── users.html          ← Lista de usuarios
│   │   └── user-detail.html    ← Gastos por usuario
│   ├── css/
│   │   ├── styles.css          ← Estilos globales
│   │   ├── auth.css            ← Login y registro
│   │   ├── dashboard.css       ← Dashboard
│   │   ├── expenses.css        ← Tabla de gastos
│   │   ├── upload.css          ← Carga de ticket
│   │   └── reports.css         ← Reportes
│   └── js/
│       ├── utils.js            ← Funciones reutilizables
│       ├── api.js              ← Llamadas al backend
│       ├── auth.js             ← Lógica de login
│       ├── dashboard.js        ← Lógica del dashboard
│       ├── expenses.js         ← Lógica de gastos
│       ├── upload.js           ← Lógica de carga
│       ├── reports.js          ← Lógica de reportes
│       ├── users.js            ← Lógica lista usuarios
│       ├── user-detail.js      ← Lógica detalle usuario
│       └── advisor-dashboard.js
└── backend/
    └── src/
        ├── auth/               ← Módulo de autenticación
        ├── users/              ← Módulo de usuarios
        ├── expenses/           ← Módulo de gastos (pendiente)
        └── app.module.ts       ← Módulo raíz
```

---

## 🧪 Cuentas de prueba

El frontend usa datos simulados. Para probar la aplicación usar las siguientes credenciales:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Usuario | user@mail.com | user |
| Asesor | asesor@mail.com | asesor |

> ⚠️ El backend real requiere registrarse en `POST /auth/register`. Las credenciales de prueba solo funcionan con el frontend en modo simulado.

---

## ⚙️ Instalación y uso

### Frontend
No requiere instalación. Abrí `frontend/index.html` con Live Server (VSCode) o cualquier servidor local.

### Backend
```bash
cd backend
npm install
```

Creá un archivo `.env` en la carpeta `backend/` con:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=ctrlgasto
JWT_SECRET=tu_clave_secreta
```

Luego iniciá el servidor:
```bash
npm run start:dev
```

El backend corre en `http://localhost:3000`

---

Benitez Emanuel - Proyecto desarrollado para la materia Ingeniería Web II — UNDEF 2026