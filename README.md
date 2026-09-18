# Actividades de la familia

App mobile-first para que los miembros de la familia controlen sus actividades
semanales. Base de datos en Turso (SQLite en la nube), desplegada en Vercel
para tener un enlace público fijo accesible desde cualquier móvil.

## Desarrollo local

```bash
npm install
cp .env.example .env   # rellena con tus credenciales reales de Turso
npx prisma migrate deploy
npm run dev
```

## Estructura
- `prisma/schema.prisma` — modelos Member y Activity
- `lib/prisma.ts` — cliente de Prisma con el adaptador de Turso/libSQL
- `lib/actions.ts` — toda la lógica CRUD (server actions)
- `lib/session.ts` — miembro activo guardado en cookie simple (sin login)
- `app/page.tsx` — selector de "quién soy" / alta de miembro
- `app/semana/page.tsx` — vista semanal con filtro todas/mías
- `app/actividades/nueva` y `app/actividades/[id]/editar` — crear y editar actividades

## Despliegue
Ver la guía paso a paso que te dio Claude en el chat: crear base de datos en
Turso, subir este código a GitHub, importar el repositorio en Vercel y
configurar las variables de entorno `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.
