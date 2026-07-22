# CtrlGasto 💰
Plataforma inteligente de gestión de gastos personales — Proyecto final Ingeniería Web II (IUA 2026)

🌐 **Frontend:** https://control-gastos-iw-2.vercel.app  
⚙️ **Backend:** https://controlgastos-iw2.onrender.com

---

## 📋 Descripción

CtrlGasto es una aplicación web fullstack que permite a los usuarios registrar y analizar sus gastos personales mediante carga manual o por foto de ticket (con interpretación por IA). Los asesores financieros tienen un panel propio para visualizar estadísticas globales y analizar los patrones de consumo de cada usuario.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, CSS, JavaScript vanilla |
| Backend | NestJS (Node.js + TypeScript) |
| Base de datos | PostgreSQL |
| ORM | TypeORM |
| Autenticación | JWT + bcrypt |
| Gráficos | Chart.js (local) |
| IA | API de OCR |
| Deploy frontend | Vercel |
| Deploy backend | Render |

---

## 📁 Estructura del proyecto

```
controlGastos_IW2/
├── frontend/
│   ├── index.html                  ← Login
│   ├── register.html               ← Registro
│   ├── dashboard.html              ← Panel principal del usuario
│   ├── expenses.html               ← Historial de gastos con filtros y paginación
│   ├── upload.html                 ← Carga de ticket por imagen o manual
│   ├── reports.html                ← Reportes y gráficos
│   ├── budgets.html                ← Presupuestos y metas de ahorro
│   ├── recommendations.html        ← Recomendaciones del asesor + automáticas
│   ├── profile.html                ← Perfil del usuario
│   ├── edit-expense.html           ← Edición de gasto
│   ├── advisor/
│   │   ├── dashboard.html          ← Panel del asesor con estadísticas globales
│   │   ├── users.html              ← Lista de usuarios registrados
│   │   ├── user-detail.html        ← Gastos y detalle de un usuario
│   │   ├── send-recommendation.html← Envío de recomendaciones + historial
│   │   └── profile.html            ← Perfil del asesor
│   ├── css/
│   │   ├── styles.css              ← Estilos globales y variables CSS (modo claro/oscuro)
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── expenses.css
│   │   ├── upload.css
│   │   ├── reports.css
│   │   └── users.css
│   └── js/
│       ├── config.js               ← Define API_URL (generado por build.js en deploy)
│       ├── api.js                  ← Todas las llamadas HTTP al backend
│       ├── components.js           ← Sidebar reutilizable con detección de página activa
│       ├── utils.js                ← Funciones transversales (auth, perfil financiero, etc.)
│       ├── auth.js
│       ├── dashboard.js
│       ├── expenses.js
│       ├── upload.js
│       ├── reports.js
│       ├── budgets.js
│       ├── recommendations.js
│       ├── profile.js
│       ├── edit-expense.js
│       ├── advisor-dashboard.js
│       ├── advisor-profile.js
│       ├── users.js
│       ├── user-detail.js
│       ├── send-recommendation.js
│       ├── build.js                ← Script de build para Vercel (inyecta API_URL)
│       └── vendor/
│           └── chart.min.js        ← Chart.js descargado localmente
└── backend/
    └── src/
        ├── auth/                   ← Registro, login, JWT, guards, decoradores
        ├── expenses/               ← CRUD de gastos, reportes, paginación
        ├── tickets/                ← Procesamiento de imágenes con IA (Anthropic)
        ├── recommendations/        ← Creación y consulta de recomendaciones
        ├── users/                  ← Gestión de usuarios y perfiles
        └── common/                 ← Filtros de excepciones y middlewares
```

---

## ⚙️ Instalación y uso local

### Requisitos previos
- Node.js 18+
- PostgreSQL corriendo localmente

### Backend

```bash
cd backend
npm install
```

Creá un archivo `.env` en la carpeta `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=ctrlgasto
JWT_SECRET=tu_clave_secreta
OCR_SPACE_API_KEY=tu_api_key_de_ocr
```

Iniciá el servidor:

```bash
npm run start:dev
```

El backend queda disponible en `http://localhost:3000`

### Frontend

No requiere instalación ni compilación. Abrí `frontend/index.html` con Live Server (extensión de VSCode).

> `config.js` tiene un fallback automático a `http://localhost:3000` cuando se corre localmente, por lo que no hace falta configurar nada en el frontend para desarrollo.

---

## 🚀 Deploy

### Frontend (Vercel)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar la carpeta raíz del proyecto como `frontend/`
3. Agregar la variable de entorno en Settings → Environment Variables:
   ```
   API_URL = https://controlgastos-iw2.onrender.com
   ```
4. Vercel ejecuta `build.js` automáticamente antes de cada deploy, que inyecta `API_URL` en `config.js`

### Backend (Render)

1. Conectar el repositorio en [render.com](https://render.com)
2. Configurar como Web Service con:
   - **Root directory:** `backend`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start:prod`
3. Agregar las mismas variables de entorno del `.env` en el panel de Render

---

## 🔌 Endpoints de la API

| Método | Ruta | Descripción | Rol |
|--------|------|-------------|-----|
| POST | /auth/register | Registrar usuario | — |
| POST | /auth/login | Iniciar sesión | — |
| GET | /expenses | Gastos del usuario (paginado) | usuario |
| POST | /expenses | Crear gasto | usuario |
| PUT | /expenses/:id | Editar gasto | usuario |
| DELETE | /expenses/:id | Eliminar gasto | usuario |
| GET | /expenses/all | Todos los gastos | asesor |
| GET | /expenses/reportes | Reportes unificados (categoría, mes, comercio) | usuario |
| POST | /tickets/upload | Procesar imagen de ticket con IA | usuario |
| GET | /recommendations | Ver recomendaciones | usuario/asesor |
| POST | /recommendations | Enviar recomendación | asesor |
| GET | /users | Listar usuarios (paginado) | asesor |
| GET | /users/:id | Ver perfil de usuario | usuario/asesor |
| PUT | /users/:id | Actualizar perfil | usuario/asesor |

---

## 🧪 Cuentas de prueba

Registrarse en `/register.html`. Para probar el rol de asesor, seleccionar "Asesor" en el campo Rol al registrarse.

---

## ✨ Funcionalidades implementadas

**Usuario:**
- Registro e inicio de sesión con JWT
- Carga de gastos manual o por imagen de ticket (IA extrae comercio, monto, fecha y categoría)
- Categorización automática por nombre de comercio
- Historial de gastos con búsqueda avanzada (fecha, categoría, monto, comercio) y paginación
- Exportación de gastos a CSV y JSON
- Reportes con gráficos de torta, barras y ranking de comercios
- Comparación de gastos entre meses
- Análisis de patrones de consumo
- Presupuestos mensuales por categoría con barra de progreso
- Meta de ahorro mensual con seguimiento
- Perfil financiero automático (ahorrador / equilibrado / impulsivo)
- Recomendaciones automáticas basadas en patrones + recomendaciones del asesor
- Detección de gastos anómalos (marcado visual en la tabla)
- Alertas de presupuesto (banner cuando se supera el límite mensual)
- Modo claro / oscuro persistente
- Carga múltiple de tickets

**Asesor:**
- Panel con estadísticas globales (total usuarios, gastos, promedio, categoría más frecuente)
- Lista de usuarios con detalle de gastos por usuario
- Envío de recomendaciones personalizadas con historial

---

Benítez Emanuel — Ingeniería Web II — IUA 2026
