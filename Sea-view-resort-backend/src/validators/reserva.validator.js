import Room from "../models/room.model.js";
import Reserva from "../models/Reserva.js";

// Valida si la habitación específica está disponible en las fechas indicadas
export const validarDisponibilidad = async ({
  roomId,
  destino,
  checkIn,
  checkOut,
}) => {
  // Obtén la habitación
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Habitación no encontrada");

  // Verifica si ya hay una reserva para esa habitación en las fechas solapadas
  const reservaExistente = await Reserva.findOne({
    roomId,
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  if (reservaExistente) {
    throw new Error("La habitación no está disponible en esas fechas");
  }
};
