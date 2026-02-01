import Room from "../models/room.model.js";
import Reserva from "../models/Reserva.js";

// Valida si hay habitaciones disponibles para el tipo y destino en las fechas
export const validarDisponibilidad = async ({
  roomId,
  destino,
  checkIn,
  checkOut,
}) => {
  // Obtén la habitación y su tipo
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Habitación no encontrada");

  // Cuenta cuántas habitaciones de ese tipo existen
  const totalHabitaciones = await Room.countDocuments({ type: room.type });

  // Cuenta cuántas reservas activas hay para ese tipo, destino y fechas solapadas
  const reservasSolapadas = await Reserva.countDocuments({
    destino,
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    roomId: { $in: await Room.find({ type: room.type }).distinct("_id") },
  });

  // Si las reservas igualan o superan el total, no hay disponibilidad
  if (reservasSolapadas >= totalHabitaciones) {
    throw new Error(
      "No hay habitaciones disponibles para ese destino y fechas"
    );
  }
};
