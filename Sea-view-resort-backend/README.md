# Backend - Sea View Resort

Backend para el sistema de reservas del hotel.

## Instalacion

```bash
npm install
```

Crear `.env`:
```
PORT=4002
MONGODB_URI=mongodb://localhost:27017/sea-view-resort
JWT_SECRET=cambiar_en_produccion
FRONTEND_URL=http://localhost:5173
```

## Correr

```bash
npm run dev
```

## Crear admin

```bash
node create-admin.js
```

## Tech

- Express + MongoDB
- JWT auth
- Nodemailer
- Multer (subir imagenes)
