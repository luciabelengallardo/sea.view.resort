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

    const response = await fetchApi("/api/reservas", {
      // POST a /api/reservas (ruta del backend)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: room._id,
        destino: reservationData.destino,
        huespedes: parseInt(reservationData.huespedes),
        // Agregar T00:00:00Z para asegurar UTC
        checkIn: reservationData.checkIn + "T00:00:00Z",
        checkOut: reservationData.checkOut + "T00:00:00Z",
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

export const checkAvailability = async (roomId, checkIn, checkOut) => {
  try {
    const response = await fetchApi(
      `/api/reservas/rooms/${roomId}/disponibilidad?checkIn=${checkIn}&checkOut=${checkOut}`,
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
