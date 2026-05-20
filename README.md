# CtrlGasto
Plataforma inteligente de gestión de gastos personales — Proyecto final Ingeniería Web II (UNDEF 2026)

---

## Descripción

CtrlGasto es una aplicación web que permite a los usuarios registrar y analizar sus gastos personales mediante la carga manual o por foto de ticket, con interpretación automática por OCR e inferencia de categoría. Los asesores financieros tienen un panel propio para visualizar los patrones de consumo de cada usuario y enviarles recomendaciones personalizadas.

---

## Funcionalidades implementadas

### Usuario
- Registro e inicio de sesión
- Dashboard con navegación por sidebar
- Historial de gastos con filtros por comercio, categoría y mes, y paginado
- Carga de gastos manual o por foto de ticket con drag & drop
- Procesamiento de ticket con OCR (extracción automática de comercio, monto, fecha y categoría)
- Reportes con gráficos de torta, barras y ranking de comercios
- Edición y eliminación de gastos
- Recepción de recomendaciones financieras del asesor
- Edición de perfil

### Asesor
- Panel con lista de usuarios registrados
- Visualización de gastos por usuario
- Envío de recomendaciones financieras a usuarios
- Edición de perfil

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | NestJS (Node.js) |
| Base de datos | PostgreSQL |
| ORM | TypeORM |
| Autenticación | JWT + bcrypt |
| OCR | OCR.space API |
| Gráficos | Chart.js |
| Deploy frontend | Vercel |
| Deploy backend | Render |

---

## URLs de producción

- Frontend: https://control-gastos-iw-2.vercel.app
- Backend: https://dashboard.render.com/project/prj-d86hn98g4nts73atsq70/environment/evm-d86hn98g4nts73atsq7g

---

## Estructura del proyecto

```
controlGastos_IW2/
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── expenses.html
│   ├── upload.html
│   ├── edit-expense.html
│   ├── reports.html
│   ├── recommendations.html
│   ├── profile.html
│   ├── advisor/
│   │   ├── dashboard.html
│   │   ├── users.html
│   │   ├── user-detail.html
│   │   ├── send-recommendation.html
│   │   └── profile.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── expenses.css
│   │   ├── upload.css
│   │   └── reports.css
│   └── js/
│       ├── utils.js
│       ├── api.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── expenses.js
│       ├── upload.js
│       ├── edit-expense.js
│       ├── reports.js
│       ├── recommendations.js
│       ├── profile.js
│       ├── users.js
│       ├── user-detail.js
│       ├── send-recommendation.js
│       ├── advisor-dashboard.js
│       └── advisor-profile.js
└── backend/
    └── src/
        ├── auth/
        ├── users/
        ├── expenses/
        ├── tickets/
        ├── recommendations/
        └── app.module.ts
```

---

## Instalacion y uso local

### Frontend

No requiere instalacion. Abrir `frontend/index.html` con Live Server (VSCode) o cualquier servidor local.

### Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta `backend/` con:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=ctrlgasto
JWT_SECRET=tu_clave_secreta
OCR_SPACE_API_KEY=tu_api_key
```

Iniciar el servidor en modo desarrollo:

```bash
npm run start:dev
```

El backend corre en `http://localhost:3000`

---

Benitez Emanuel - Ingenieria Web II - UNDEF 2026
