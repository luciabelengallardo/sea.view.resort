import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import DestinationSelect from "../../components/search/DestinationSelect.jsx";
import RoomTypeSelect from "../../components/search/RoomTypeSelect.jsx";
import GuestsSelect from "../../components/search/GuestsSelect.jsx";
import DateRangePicker from "../../components/search/DateRangePicker.jsx";
import AvailabilityModal from "../booking/AvailabilityModal";
import SuccessModal from "../booking/SuccessModal";
import LoginRequiredModal from "../auth/LoginRequiredModal";
import { useAuth } from "../../context/AuthContext";
import { useRooms } from "../../context/RoomsContext";
import { toast } from "react-hot-toast";
import { checkAvailability } from "../../services/reserva";

export default function SearchFilters() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms } = useRooms();

  const [filters, setFilters] = useState({
    destino: "",
    habitacion: "",
    huespedes: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    })(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(0);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Función para obtener el precio de la habitación seleccionada
  const getRoomPrice = (roomName) => {
    const room = rooms.find((r) => r.name === roomName);
    return room ? room.price : 150; // Precio por defecto si no se encuentra
  };

  // Actualizar el precio cuando cambie la habitación seleccionada
  useEffect(() => {
    if (filters.habitacion) {
      const price = getRoomPrice(filters.habitacion);
      setSelectedRoomPrice(price);
    }
  }, [filters.habitacion, rooms]);

  const handleSearch = async () => {
    // Validar que se haya seleccionado una habitación
    if (!filters.habitacion) {
      alert("Por favor selecciona una habitación antes de buscar");
      return;
    }

    setIsLoading(true);
    try {
      // reemplaza con tu endpoint
      //const response = await axios.post('http://localhost:5173/api/reserva', filters);

      // Procesar la respuesta y calcular información adicional
      const processedData = {
        ...filters,
        ...response.data,
        noches: calculateNights(filters.checkIn, filters.checkOut),
        precioTotal:
          response.data.precioPorNoche *
          calculateNights(filters.checkIn, filters.checkOut),
      };

      setAvailabilityData(processedData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      // En caso de error, mostrar datos de ejemplo para demostración
      const precioPorNoche = getRoomPrice(filters.habitacion);
      const mockData = {
        ...filters,
        disponible: Math.random() > 0.5, // Simular disponibilidad aleatoria
        precioPorNoche: precioPorNoche,
        noches: calculateNights(filters.checkIn, filters.checkOut),
        precioTotal:
          precioPorNoche * calculateNights(filters.checkIn, filters.checkOut),
        diasDisponibles: generateAvailableDates(
          filters.checkIn,
          filters.checkOut,
        ),
      };
      setAvailabilityData(mockData);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const generateAvailableDates = (checkIn, checkOut) => {
    // Generar fechas alternativas disponibles más variadas
    const dates = [];
    const startDate = new Date(checkIn);

    // Asegurar que las fechas sean desde hoy en adelante
    const minDate = new Date();

    // Generar fechas en diferentes rangos para dar más opciones
    const ranges = [
      { start: 1, end: 3 }, // Próximos días
      { start: 7, end: 10 }, // Semana siguiente
      { start: 14, end: 17 }, // Dos semanas después
      { start: 21, end: 24 }, // Tres semanas después
      { start: 30, end: 35 }, // Un mes después
      { start: 60, end: 65 }, // Dos meses después
    ];

    ranges.forEach((range) => {
      for (let i = range.start; i <= range.end; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);

        // Solo agregar fechas que sean después del 20 de agosto de 2025
        if (newDate >= minDate) {
          dates.push(newDate.toISOString().split("T")[0]);
        }
      }
    });

    return dates;
  };

  const handleConfirmReservation = async (data) => {
    // Verificar si el usuario está logueado
    if (!user) {
      // Si no está logueado, mostrar el modal de login requerido
      setIsLoginRequiredModalOpen(true);
      return;
    }

    try {
      console.log("Confirmando reserva:", data);
      // Ejemplo: await axios.post('http://localhost:5000/api/reservas', data);

      // Simular un pequeño delay para mostrar el proceso
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Guardar los datos de la reserva confirmada y mostrar el modal de éxito
      setConfirmedReservation(data);
      setIsSuccessModalOpen(true);
      // Cerrar el modal de disponibilidad
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      toast.error("Error al crear la reserva: " + error.message);
      throw error;
    }
  };

  const handleNavigateToLogin = () => {
    setIsLoginRequiredModalOpen(false);
    setIsModalOpen(false);
    navigate("/login");
  };

  const handleNavigateToRegister = () => {
    setIsLoginRequiredModalOpen(false);
    setIsModalOpen(false);
    navigate("/register");
  };

  const handleSelectAlternativeDate = async (selectedDate) => {
    try {
      // Calcular la nueva fecha de check-out (mantener la misma duración de estadía)
      const checkInDate = new Date(selectedDate);
      const originalCheckIn = new Date(filters.checkIn);
      const originalCheckOut = new Date(filters.checkOut);
      const nightsDiff = Math.ceil(
        (originalCheckOut - originalCheckIn) / (1000 * 60 * 60 * 24),
      );

      const newCheckOutDate = new Date(checkInDate);
      newCheckOutDate.setDate(checkInDate.getDate() + nightsDiff);

      // Actualizar los filtros con las nuevas fechas
      const updatedFilters = {
        ...filters,
        checkIn: selectedDate,
        checkOut: newCheckOutDate.toISOString().split("T")[0],
      };

      setFilters(updatedFilters);

      // Hacer una nueva búsqueda con las fechas actualizadas
      setIsLoading(true);

      // Simular llamada a la API con las nuevas fechas
      const precioPorNoche = getRoomPrice(updatedFilters.habitacion);
      const mockData = {
        ...updatedFilters,
        disponible: Math.random() > 0.3, // Mayor probabilidad de disponibilidad
        precioPorNoche: precioPorNoche,
        noches: calculateNights(
          selectedDate,
          newCheckOutDate.toISOString().split("T")[0],
        ),
        precioTotal:
          precioPorNoche *
          calculateNights(
            selectedDate,
            newCheckOutDate.toISOString().split("T")[0],
          ),
        diasDisponibles: generateAvailableDates(
          selectedDate,
          newCheckOutDate.toISOString().split("T")[0],
        ),
      };

      setAvailabilityData(mockData);
      // El modal ya está abierto, solo actualizamos los datos
    } catch (error) {
      console.error("Error al seleccionar fecha alternativa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 lg:gap-6 items-end">
            <div className="md:col-span-2">
              <DestinationSelect
                value={filters.destino}
                onChange={(v) => handleChange("destino", v)}
              />
            </div>

            <div className="md:col-span-2">
              <RoomTypeSelect
                value={filters.habitacion}
                onChange={(v) => handleChange("habitacion", v)}
                rooms={rooms}
              />
            </div>

            <div className="md:col-span-2">
              <GuestsSelect
                value={filters.huespedes}
                onChange={(v) => handleChange("huespedes", v)}
              />
            </div>

            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateRangePicker
                checkIn={filters.checkIn}
                checkOut={filters.checkOut}
                onChange={handleChange}
              />
            </div>

            <div className="mt-2 md:mt-0 flex md:col-span-2 md:justify-start self-end">
              <Button
                size="md"
                className={`w-full md:w-full ${!filters.habitacion ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSearch}
                disabled={isLoading || !filters.habitacion}
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de disponibilidad */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availabilityData={availabilityData}
        onConfirmReservation={handleConfirmReservation}
        onSelectAlternativeDate={handleSelectAlternativeDate}
        isLoading={isLoading}
        user={user}
      />

      {/* Modal de confirmación exitosa */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        reservationData={confirmedReservation}
      />

      {/* Modal de login requerido */}
      <LoginRequiredModal
        isOpen={isLoginRequiredModalOpen}
        onClose={() => setIsLoginRequiredModalOpen(false)}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToRegister={handleNavigateToRegister}
      />
    </>
  );
}
