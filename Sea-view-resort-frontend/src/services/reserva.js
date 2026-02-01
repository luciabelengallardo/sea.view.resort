// Servicio de reservas (aplicable a SOLID - DIP)
// Maneja todas las operaciones relacionadas con reservas

/**
 * @typedef {Object} ReservationData
 * @property {string} habitacion - Nombre de la habitación
 * @property {string} destino - Destino de la reserva
 * @property {string} huespedes - Cantidad de huéspedes
 * @property {string} checkIn - Fecha de check-in
 * @property {string} checkOut - Fecha de check-out
 * @property {number} precioPorNoche - Precio por noche
 */

/**
 * Crear una nueva reserva
 * @param {ReservationData} reservationData - Datos de la reserva
 * @returns {Promise<Object>} - Reserva creada
 */
import { fetchApi } from "./http";

export const createReservation = async (reservationData) => {
  try {
    // Buscar la habitación para obtener el roomId
    const roomsResponse = await fetchApi("/api/rooms");
    const rooms = await roomsResponse.json();
    const room = rooms.find((r) => r.name === reservationData.habitacion);

    if (!room) {
      throw new Error("Habitación no encontrada");
    }

    const response = await fetchApi("/api/reserva", {
      //  Cambiar de 'reservas' a 'reserva'
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: room._id,
        destino: reservationData.destino,
        huespedes: parseInt(reservationData.huespedes),
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        precioPorNoche: reservationData.precioPorNoche,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al crear la reserva");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

/**
 * Obtener todas las reservas
 * @returns {Promise<Array>} - Lista de reservas
 */
export const getReservations = async () => {
  try {
    const response = await fetchApi("/api/reservas"); //  Esta URL está bien
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

/**
 * Verificar disponibilidad de una habitación
 * @param {string} roomId - ID de la habitación
 * @param {string} checkIn - Fecha de check-in
 * @param {string} checkOut - Fecha de check-out
 * @returns {Promise<Object>} - Resultado de disponibilidad
 */
export const checkAvailability = async (roomId, checkIn, checkOut) => {
  try {
    const response = await fetchApi(
      `/api/rooms/${roomId}/disponibilidad?checkIn=${checkIn}&checkOut=${checkOut}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw error;
  }
};

/**
 * Actualizar una reserva
 * @param {string} reservationId - ID de la reserva
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<Object>} - Reserva actualizada
 */
export const updateReservation = async (reservationId, updateData) => {
  try {
    const response = await fetchApi(`/api/reservas/${reservationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la reserva");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};

/**
 * Eliminar una reserva
 * @param {string} reservationId - ID de la reserva
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteReservation = async (reservationId) => {
  try {
    const response = await fetchApi(`/api/reservas/${reservationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar la reserva");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};
