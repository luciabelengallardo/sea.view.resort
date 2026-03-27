import dayjs from "dayjs";
import Reserva from "../models/Reserva.js";
import { validarDisponibilidad } from "../validators/reserva.validator.js";

export const getRoomDisponibilidad = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const roomId = req.params.id;

    // Buscar si hay reservas que se solapen con las fechas
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

    // Buscar fechas alternativas en los próximos 90 días
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedCheckIn = new Date(checkIn);
    requestedCheckIn.setHours(0, 0, 0, 0);

    // Empezar desde hoy o desde la fecha solicitada, lo que sea más tarde
    const startDate = requestedCheckIn > today ? today : new Date(today);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 90);

    const todasLasReservas = await Reserva.find({
      roomId: roomId,
      checkOut: { $gt: today.toISOString() },
      checkIn: { $lt: endDate.toISOString() },
    });

    // Ver qué días están libres
    const alternativeDates = [];
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const currentDateNormalized = new Date(currentDate);
      currentDateNormalized.setHours(0, 0, 0, 0);

      // Ver si está ocupado
      const estaOcupado = todasLasReservas.some((reserva) => {
        // Parsear fechas de MongoDB
        const reservaCheckInDate = new Date(reserva.checkIn);
        const reservaCheckIn = new Date(
          reservaCheckInDate.getUTCFullYear(),
          reservaCheckInDate.getUTCMonth(),
          reservaCheckInDate.getUTCDate(),
        );

        const reservaCheckOutDate = new Date(reserva.checkOut);
        const reservaCheckOut = new Date(
          reservaCheckOutDate.getUTCFullYear(),
          reservaCheckOutDate.getUTCMonth(),
          reservaCheckOutDate.getUTCDate(),
        );

        const ocupado =
          currentDateNormalized >= reservaCheckIn &&
          currentDateNormalized < reservaCheckOut;
        return ocupado;
      });

      if (!estaOcupado) {
        alternativeDates.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      disponible: false,
      alternativeDates: alternativeDates.map((d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }),
    });
  } catch (err) {
    console.error("Error al verificar disponibilidad:", err);
    res.status(500).json({ error: "Error al verificar disponibilidad" });
  }
};

export const getOccupiedDates = async (req, res) => {
  try {
    const { id } = req.params;

    // Traer reservas de los próximos 90 días
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const in90Days = new Date(today);
    in90Days.setDate(today.getDate() + 90);

    const reservas = await Reserva.find({
      roomId: id,
      checkOut: { $gt: today },
      checkIn: { $lt: in90Days },
    });

    const occupiedDates = [];
    reservas.forEach((reserva) => {
      // Parsear fechas
      const checkInDate = new Date(reserva.checkIn);
      const checkIn = new Date(
        checkInDate.getUTCFullYear(),
        checkInDate.getUTCMonth(),
        checkInDate.getUTCDate(),
      );

      const checkOutDate = new Date(reserva.checkOut);
      const checkOut = new Date(
        checkOutDate.getUTCFullYear(),
        checkOutDate.getUTCMonth(),
        checkOutDate.getUTCDate(),
      );

      for (
        let d = new Date(checkIn);
        d < checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        // Formatear sin usar toISOString para evitar conversión a UTC
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        if (!occupiedDates.includes(dateStr)) {
          occupiedDates.push(dateStr);
        }
      }
    });

    res.json({ occupiedDates });
  } catch (err) {
    console.error("getOccupiedDates error:", err);
    res.status(500).json({ error: "Error al obtener fechas ocupadas" });
  }
};

export const createReserva = async (req, res) => {
  try {
    let { roomId, checkIn, checkOut, destino, huespedes } = req.body;
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: "Usuario no autenticado" });

    // Convertir fechas en formato YYYY-MM-DD a Date correctamente en timezone local
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      date.setHours(0, 0, 0, 0);
      return date;
    };

    // Si las fechas son strings en formato YYYY-MM-DD, convertir correctamente
    if (typeof checkIn === "string" && checkIn.match(/^\d{4}-\d{2}-\d{2}$/)) {
      checkIn = parseDate(checkIn);
    }
    if (typeof checkOut === "string" && checkOut.match(/^\d{4}-\d{2}-\d{2}$/)) {
      checkOut = parseDate(checkOut);
    }

    // Que no reserve en el pasado (permite reservar desde hoy)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res
        .status(400)
        .json({ error: "No se pueden reservar fechas pasadas" });
    }

    // Asegurar que checkOut sea posterior a checkIn
    if (!dayjs(checkOut).isAfter(checkIn)) {
      return res.status(400).json({
        error: "La fecha de salida debe ser posterior a la de entrada",
      });
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

    // Validar que no exceda el máximo de huéspedes
    const maxGuests = room.maxGuests || 4;
    if (huespedes > maxGuests) {
      return res.status(400).json({
        error: `Esta habitación admite máximo ${maxGuests} huéspedes`,
      });
    }

    // Ver si hay conflictos de fecha
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

    // Calcular noches y precio
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
    const reservas = await Reserva.find(filter)
      .populate("roomId")
      .populate("userId", "username email") // Poblar userId con username y email
      .sort({ checkIn: -1 }); // Ordenar por fecha de check-in descendente (más recientes primero)

    // Si no pasaron total, lo calculo
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
