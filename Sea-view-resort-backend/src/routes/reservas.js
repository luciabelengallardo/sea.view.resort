import express from "express";
import {
  getRoomDisponibilidad,
  getOccupiedDates,
  createReserva,
  getReservas,
  updateReserva,
  deleteReserva,
} from "../controllers/roomClienteController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = express.Router();

// Disponibilidad de habitación
router.get("/rooms/:id/disponibilidad", getRoomDisponibilidad);

// Fechas ocupadas de una habitación (sin autenticación)
router.get("/rooms/:id/occupied-dates", getOccupiedDates);

// CRUD reservas (autenticación requerida) - rutas montadas en /api/reservas
router.post("/", authRequired, createReserva);
router.get("/", authRequired, getReservas);
router.put("/:id", authRequired, updateReserva);
router.delete("/:id", authRequired, deleteReserva);

export default router;
