import dayjs from "dayjs";
import Reserva from "../models/Reserva.js";
import { validarDisponibilidad } from "../validators/reserva.validator.js";

// Obtener disponibilidad de una habitación
export const getRoomDisponibilidad = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const roomId = req.params.id;

    // Verificar si hay conflicto en las fechas solicitadas
    const reservas = await Reserva.find({
      roomId: roomId,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    const disponible = reservas.length === 0;

    if (disponible) {
      res.json({ disponible: true });
      return;
    }

    // Si NO está disponible, calcular fechas alternativas
    // Obtener todas las reservas para esta habitación en los próximos 90 días
    const startDate = new Date(checkIn);
    startDate.setHours(0, 0, 0, 0); // Normalizar a medianoche

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 90);

    const todasLasReservas = await Reserva.find({
      roomId: roomId,
      checkOut: { $gt: checkIn },
      checkIn: { $lt: endDate.toISOString() },
    });

    // Calcular noches requeridas
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nightsRequired = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );

    // Generar fechas alternativas
    const alternativeDates = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const potentialCheckOut = new Date(currentDate);
      potentialCheckOut.setDate(potentialCheckOut.getDate() + nightsRequired);

      // Verificar si este rango está disponible
      const conflicto = todasLasReservas.some((reserva) => {
        const reservaCheckIn = new Date(reserva.checkIn);
        const reservaCheckOut = new Date(reserva.checkOut);

        // Hay conflicto si se solapan:
        // currentDate < reservaCheckOut AND potentialCheckOut > reservaCheckIn
        return (
          currentDate < reservaCheckOut && potentialCheckOut > reservaCheckIn
        );
      });

      if (!conflicto) {
        alternativeDates.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(
      `Disponibilidad - Room: ${roomId}, Fechas solicitadas: ${checkIn} a ${checkOut}, Noches: ${nightsRequired}, Alternativas encontradas: ${alternativeDates.length}`,
    );

    res.json({
      disponible: false,
      alternativeDates: alternativeDates.map(
        (d) => d.toISOString().split("T")[0],
      ),
    });
  } catch (err) {
    console.error("Error al verificar disponibilidad:", err);
    res.status(500).json({ error: "Error al verificar disponibilidad" });
  }
};

// Obtener fechas ocupadas de una habitación (sin requerir autenticación)
export const getOccupiedDates = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Consultando fechas ocupadas para habitación: ${id}`);

    // Obtener las 90 próximas reservas de esta habitación
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const in90Days = new Date(today);
    in90Days.setDate(today.getDate() + 90);

    const reservas = await Reserva.find({
      roomId: id,
      checkOut: { $gt: today },
      checkIn: { $lt: in90Days },
    });

    console.log(`Encontradas ${reservas.length} reservas para esta habitación`);

    // Extraer todas las fechas ocupadas
    const occupiedDates = [];
    reservas.forEach((reserva) => {
      const checkIn = new Date(reserva.checkIn);
      checkIn.setHours(0, 0, 0, 0);

      const checkOut = new Date(reserva.checkOut);
      checkOut.setHours(0, 0, 0, 0);

      for (
        let d = new Date(checkIn);
        d < checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        if (!occupiedDates.includes(dateStr)) {
          occupiedDates.push(dateStr);
        }
      }
    });

    console.log(
      `Fechas ocupadas totales: ${occupiedDates.length}`,
      occupiedDates.slice(0, 5),
    );

    res.json({ occupiedDates });
  } catch (err) {
    console.error("getOccupiedDates error:", err);
    res.status(500).json({ error: "Error al obtener fechas ocupadas" });
  }
};

// Crear una reserva
export const createReserva = async (req, res) => {
  try {
    let { roomId, checkIn, checkOut, destino, huespedes } = req.body;
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuario no autenticado" });

    // Convertir fechas en formato YYYY-MM-DD a Date correctamente en UTC
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-");
      return new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0),
      );
    };

    // Si las fechas son strings en formato YYYY-MM-DD, convertir correctamente
    if (typeof checkIn === "string" && checkIn.match(/^\d{4}-\d{2}-\d{2}$/)) {
      checkIn = parseDate(checkIn);
    }
    if (typeof checkOut === "string" && checkOut.match(/^\d{4}-\d{2}-\d{2}$/)) {
      checkOut = parseDate(checkOut);
    }

    // Asegurar que checkOut sea posterior a checkIn
    if (!dayjs(checkOut).isAfter(checkIn)) {
      return res.status(400).json({ error: "Fechas inválidas" });
    }

    if (!Number.isInteger(huespedes) || huespedes < 1) {
      return res.status(400).json({ error: "Cantidad de huéspedes inválida" });
    }

    // Obtener la habitación para validar que existe y obtener su precio
    const Room = (await import("../models/room.model.js")).default;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(400).json({ error: "Habitación no encontrada" });
    }

    // Validar disponibilidad global por tipo y destino
    try {
      await validarDisponibilidad({ roomId, destino, checkIn, checkOut });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Buscar conflicto por roomId, destino y fechas solapadas
    const conflicto = await Reserva.findOne({
      roomId,
      destino,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    if (conflicto) {
      return res.status(400).json({
        error: "La habitación no está disponible en ese destino y fechas",
      });
    }

    // Calcular número de noches y usar precio de la habitación
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
    );
    const precioPorNoche = room.price || 0;
    const total = precioPorNoche * nights;

    const reserva = new Reserva({
      roomId,
      checkIn,
      checkOut,
      destino,
      huespedes,
      userId,
      precioPorNoche,
      total,
    });
    await reserva.save();
    res.status(201).json(reserva);
  } catch (err) {
    console.error("createReserva error:", err);
    res.status(500).json({ error: "Error al crear reserva" });
  }
};

// Listar reservas
export const getReservas = async (req, res) => {
  try {
    // Si es admin devuelve todas, si no devuelve solo las reservas del usuario
    const isAdmin = req.user?.role === "admin";
    const filter = isAdmin ? {} : { userId: req.user?.id };
    const reservas = await Reserva.find(filter).populate("roomId");

    // Calcular total si no existe o es 0
    const reservasConTotal = reservas.map((reserva) => {
      const doc = reserva.toObject ? reserva.toObject() : reserva;
      if (!doc.total || doc.total === 0) {
        if (doc.precioPorNoche && doc.checkIn && doc.checkOut) {
          const nights = Math.ceil(
            (new Date(doc.checkOut) - new Date(doc.checkIn)) /
              (1000 * 60 * 60 * 24),
          );
          doc.total = doc.precioPorNoche * nights;
        }
      }
      return doc;
    });

    res.json(reservasConTotal);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

// Actualizar reserva
export const updateReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ error: "No encontrada" });

    // Only owner or admin can update
    if (
      req.user?.role !== "admin" &&
      String(reserva.userId) !== String(req.user?.id)
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    Object.assign(reserva, req.body);
    await reserva.save();
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar reserva" });
  }
};

// Eliminar reserva
export const deleteReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ error: "No encontrada" });

    if (
      req.user?.role !== "admin" &&
      String(reserva.userId) !== String(req.user?.id)
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await Reserva.findByIdAndDelete(req.params.id);
    res.json({ message: "Reserva eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar reserva" });
  }
};
