# Aliclik - Prueba Técnica (Fullstack)

Este repositorio implementa la prueba descrita en el documento adjunto: aplicación web responsive con **autenticación JWT**, **CRUD de usuarios** y **listado de Pokémon** consumiendo **PokeAPI**, usando:

- **Frontend:** Next.js + React + Redux
- **Backend:** NestJS + Prisma + MySQL

Requisitos funcionales (según el enunciado):
- Registro y login con JWT, rutas protegidas, expiración y manejo de errores.
- CRUD de usuarios con validaciones y acceso por autenticación.
- Listado de Pokémon con paginación/carga incremental y manejo de errores.
- Testing (unitario e integración) y documentación.

> Fuente: documento `Prueba técnica.docx`. fileciteturn1file0L5-L61

---

## Arquitectura

### Autenticación
- El backend emite un **JWT** con expiración (por defecto **15m**) y lo guarda en una **cookie HttpOnly** (`access_token`).
- El frontend llama al backend con `credentials: 'include'`, y protege rutas del cliente usando `RequireAuth`.
- Al expirar la sesión, el backend responde `401` y el frontend redirige a `/login`.

### Módulos
- **Backend**
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `GET /auth/me` (protegido)
  - `GET/POST/PUT/DELETE /users` (CRUD protegido)
- **Frontend**
  - `/login` y `/register`
  - `/dashboard/users` (CRUD)
  - `/pokemon` (PokeAPI, carga incremental)

---

## Ejecución rápida (Docker)

### 1) Levantar todo
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- MySQL: `localhost:3306`

### 2) Inicializar la base de datos (Prisma)
En otra terminal:
```bash
docker compose exec backend npm run prisma:generate
docker compose exec backend npm run prisma:migrate
```

> Nota: `prisma migrate dev` crea/actualiza el esquema en MySQL.

---

## Ejecución local (sin Docker)

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

## Validaciones, seguridad y manejo de errores
- DTOs con `class-validator` (email, minLength password, etc.).
- Rutas protegidas con `JwtAuthGuard` en backend.
- Manejo de expiración de token por JWT (y cookie maxAge). Si expira: respuesta `401`.
- CORS con `credentials: true` para permitir cookies entre frontend/backend en entorno local.

---

## Testing

### Backend
Unit tests (servicios) con mocks de Prisma:
```bash
cd backend
npm test
```

### Frontend
Test básico sobre `apiFetch`:
```bash
cd frontend
npm test
```

---

## Despliegue
- Incluye `Dockerfile` para `backend` y `frontend`, y `docker-compose.yml` para levantar la plataforma.
- Para producción, se recomienda:
  - `JWT_SECRET` fuerte
  - `secure: true` para cookies
  - configurar dominios/CORS acorde al entorno

---

## Entrega
1. Subir este repo a GitHub.
2. Compartir el enlace según el enunciado.

