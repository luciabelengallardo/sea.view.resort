import express from "express";
import {
  getRoomDisponibilidad,
  createReserva,
  getReservas,
  updateReserva,
  deleteReserva
} from "../controllers/roomClienteController.js";

const router = express.Router();

// Disponibilidad de habitación
router.get("/rooms/:id/disponibilidad", getRoomDisponibilidad);

// CRUD reservas
router.post("/reservas", createReserva);
router.get("/reservas", getReservas);
router.put("/reservas/:id", updateReserva);
router.delete("/reservas/:id", deleteReserva);

export default router;