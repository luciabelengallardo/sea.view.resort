# 🌐 Sea View Resort - Backend

¡Bienvenido al **Backend de Sea View Resort**! 🎉  
Este proyecto es una **API REST robusta y escalable**, construida con **Node.js + Express.js**, diseñada para gestionar los servicios, usuarios y reservas de un resort.  
La base de datos está implementada con **MongoDB Atlas**, ofreciendo un almacenamiento flexible y eficiente.

---

## 🚀 Características Principales

- 🔑 **Autenticación de Usuarios**  
  Gestión de usuarios y sesiones seguras con JWT.  
- 🏨 **Gestión de Habitaciones**  
  CRUD completo (Crear, Leer, Actualizar, Borrar).  
- 🗄️ **Conexión a MongoDB**  
  Conexión y modelado con **Mongoose**.  
- ⚙️ **Configuración Flexible**  
  Variables de entorno en `.env` para múltiples entornos.  
- 📂 **Servidor de Archivos**  
  Manejo de imágenes y archivos estáticos.  
- 📋 **Logging de Solicitudes**  
  Registro de peticiones HTTP con **morgan**.  
- 📧 **Envío de Emails**  
  Integración con **Nodemailer** para notificaciones.  

---

## 🛠️ Tecnologías y Dependencias

- [Node.js](https://nodejs.org/)  
- [Express.js](https://expressjs.com/)  
- [MongoDB + Mongoose](https://mongoosejs.com/)  
- [dotenv](https://www.npmjs.com/package/dotenv)  
- [cors](https://www.npmjs.com/package/cors)  
- [bcrypt / bcryptjs](https://www.npmjs.com/package/bcrypt)  
- [jsonwebtoken (JWT)](https://www.npmjs.com/package/jsonwebtoken)  
- [morgan](https://www.npmjs.com/package/morgan)  
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)  
- [multer](https://www.npmjs.com/package/multer)  
- [nodemailer](https://nodemailer.com/)  
- [nodemon](https://www.npmjs.com/package/nodemon)  

---

## ⚙️ Configuración e Instalación

### 📌 Prerrequisitos
- **Node.js** (v18 o superior)  
- **npm** (incluido con Node.js)  
- **MongoDB** (local o remoto)  

### 📥 Pasos de Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/seaview-backend.git
   cd seaview-backend

Instalar dependencias:
npm install

Crear el archivo .env en la raíz (puedes basarte en .env.example):

PORT=4002
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/Searesort
SECRET_KEY_TOKEN=tu_clave_secreta
NODE_ENV=development

# Variables para envío de emails
MAIL_HOST=smtp.tuservidor.com
MAIL_PORT=587
MAIL_USER=tu_correo@dominio.com
MAIL_PASS=tu_password
MAIL_FROM="Sea Resort <no-reply@searesort.com>"

▶️ Ejecución del Proyecto
🔹 Modo Desarrollo
npm run dev

Ejecuta el servidor con nodemon para reinicio automático en cambios.

🔹 Modo Producción
npm start

Ejecuta el servidor en modo producción.

📂 Estructura del Proyecto
├── app.js            # Configuración principal de Express y middlewares
├── db.js             # Conexión a MongoDB con Mongoose
├── index.js          # Punto de entrada de la aplicación
├── package.json      # Dependencias y scripts
├── .env              # Variables de entorno
├── .env.example      # Ejemplo de configuración
├── .gitignore        # Archivos ignorados por Git
└── routes/           # Definición de rutas principales (auth, rooms, reservations)

📑 Documentación de la API
| Recurso          | Método | Ruta                    | Descripción                                 | Autenticación |
| ---------------- | ------ | ----------------------- | ------------------------------------------- | ------------- |
| **Auth**         | POST   | `/api/auth/register`    | Registrar un nuevo usuario                  | ❌             |
|                  | POST   | `/api/auth/login`       | Iniciar sesión y obtener token JWT          | ❌             |
|                  | GET    | `/api/auth/profile`     | Obtener perfil del usuario autenticado      | ✅ JWT         |
| **Usuarios**     | GET    | `/api/users`            | Listar todos los usuarios                   | ✅ Admin       |
|                  | GET    | `/api/users/:id`        | Obtener un usuario por ID                   | ✅ JWT         |
|                  | PUT    | `/api/users/:id`        | Actualizar datos de un usuario              | ✅ JWT         |
|                  | DELETE | `/api/users/:id`        | Eliminar usuario                            | ✅ Admin       |
| **Habitaciones** | GET    | `/api/rooms`            | Listar todas las habitaciones               | ❌             |
|                  | GET    | `/api/rooms/:id`        | Obtener detalle de una habitación           | ❌             |
|                  | POST   | `/api/rooms`            | Crear nueva habitación                      | ✅ Admin       |
|                  | PUT    | `/api/rooms/:id`        | Editar habitación                           | ✅ Admin       |
|                  | DELETE | `/api/rooms/:id`        | Eliminar habitación                         | ✅ Admin       |
| **Reservas**     | GET    | `/api/reservations`     | Listar reservas del usuario o todas (admin) | ✅ JWT         |
|                  | POST   | `/api/reservations`     | Crear nueva reserva                         | ✅ JWT         |
|                  | GET    | `/api/reservations/:id` | Ver detalle de una reserva                  | ✅ JWT         |
|                  | PUT    | `/api/reservations/:id` | Actualizar reserva                          | ✅ JWT         |
|                  | DELETE | `/api/reservations/:id` | Cancelar reserva                            | ✅ JWT         |


🤝 Contribuciones

Las contribuciones son bienvenidas 🚀.
Puedes abrir un issue o enviar un pull request en el repositorio.

✍️ Autores
Proyecto desarrollado por el equipo de RollingCode School:

- Nelson Juarez Rivas

- Natividad Rodriguez

- Lucia Gallardo

- Santiago Nieva

- José Perez
