import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import AvailabilityModal from "../booking/AvailabilityModal";
import SuccessModal from "../booking/SuccessModal";
import LoginRequiredModal from "../auth/LoginRequiredModal";
import DateRangePicker from "../search/DateRangePicker";
import { checkAvailability, createReservation } from "../../services/reserva";

export default function BookingSidebar({ pricePerNight, roomName, roomId }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    })(),
    huespedes: "2 Adultos",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [disabledDates, setDisabledDates] = useState([]);

  // calcular noches
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const total = pricePerNight * nights;

  // obtener fechas ocupadas al cargar el componente
  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const response = await axios.get(
          `/api/reservas/rooms/${roomId}/occupied-dates`,
        );
        setDisabledDates(response.data.occupiedDates || []);
      } catch (error) {
        console.error("Error obteniendo fechas ocupadas:", error);
      }
    };

    if (roomId) {
      fetchDisabledDates();
    }
  }, [roomId]);

  const handleChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const generateAvailableDates = (checkIn, checkOut) => {
    const dates = [];
    const startDate = new Date(checkIn);
    const minDate = new Date();

    const ranges = [
      { start: 1, end: 3 },
      { start: 7, end: 10 },
      { start: 14, end: 17 },
      { start: 21, end: 24 },
      { start: 30, end: 35 },
      { start: 60, end: 65 },
    ];

    ranges.forEach((range) => {
      for (let i = range.start; i <= range.end; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        if (newDate >= minDate) {
          dates.push(newDate.toISOString().split("T")[0]);
        }
      }
    });

    return dates;
  };

  const handleSearch = async () => {
    // validar fechas no sean pasadas (permite reservar desde hoy)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(bookingData.checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      toast.error("No se pueden reservar fechas pasadas");
      return;
    }

    setIsLoading(true);
    try {
      // consultar disponibilidad en la API
      const availabilityResponse = await checkAvailability(
        roomId,
        bookingData.checkIn,
        bookingData.checkOut,
      );

      // procesar la respuesta
      const mockData = {
        ...bookingData,
        habitacion: roomName,
        roomId: roomId,
        disponible:
          availabilityResponse.disponible || availabilityResponse.available,
        precioPorNoche: pricePerNight,
        noches: nights,
        precioTotal: total,
        diasDisponibles: availabilityResponse.alternativeDates || [], // agregar fechas alternativas del backend
      };

      setAvailabilityData(mockData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      toast.error("Error al verificar disponibilidad: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReservation = async (data) => {
    if (!user) {
      setIsLoginRequiredModalOpen(true);
      return;
    }

    try {
      // crear la reserva en el backend
      const payload = {
        habitacion: data.habitacion || roomName,
        destino: "Sea View Resort", // destino fijo ya que el usuario eligio la habitación
        huespedes: data.huespedes,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        precioPorNoche: data.precioPorNoche || pricePerNight,
      };

      const created = await createReservation(payload);

      setConfirmedReservation(created);
      setIsSuccessModalOpen(true);
      setIsModalOpen(false);
      toast.success("¡Reserva confirmada exitosamente!");
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
      const dateToISOString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const checkInString = dateToISOString(selectedDate);
      const checkInDate = new Date(selectedDate);
      const originalCheckIn = new Date(bookingData.checkIn);
      const originalCheckOut = new Date(bookingData.checkOut);
      const nightsDiff = Math.ceil(
        (originalCheckOut - originalCheckIn) / (1000 * 60 * 60 * 24),
      );

      const newCheckOutDate = new Date(checkInDate);
      newCheckOutDate.setDate(checkInDate.getDate() + nightsDiff);
      const checkOutString = dateToISOString(newCheckOutDate);

      const updatedBookingData = {
        ...bookingData,
        checkIn: checkInString,
        checkOut: checkOutString,
      };

      setBookingData(updatedBookingData);
      setIsLoading(true);

      // consultar disponibilidad con las nuevas fechas
      const availabilityResponse = await checkAvailability(
        roomId,
        selectedDate,
        newCheckOutDate.toISOString().split("T")[0],
      );

      const newNights = calculateNights(
        selectedDate,
        newCheckOutDate.toISOString().split("T")[0],
      );
      const newSubtotal = pricePerNight * newNights;
      const newTotal = newSubtotal + 25000 + 30000;

      const mockData = {
        ...updatedBookingData,
        habitacion: roomName,
        roomId: roomId,
        disponible:
          availabilityResponse.disponible || availabilityResponse.available,
        precioPorNoche: pricePerNight,
        noches: newNights,
        precioTotal: newTotal,
        diasDisponibles: availabilityResponse.alternativeDates || [], // agregar fechas alternativas del backend
      };

      setAvailabilityData(mockData);
    } catch (error) {
      console.error("Error al seleccionar fecha alternativa:", error);
      toast.error("Error al verificar disponibilidad: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="sticky"
      style={{ top: "calc(var(--app-header-height, 64px) + 1rem)" }}
    >
      <Card className="border-2 border-resort-olive/20">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                ${pricePerNight.toLocaleString()}
              </span>
              <span className="text-resort-slate">/noche</span>
            </div>
            <p className="text-sm text-resort-olive font-medium">
              Beneficios exclusivos por reserva anticipada
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {/* fechas de check-in y check-out */}
            <div className="space-y-2">
              <DateRangePicker
                checkIn={bookingData.checkIn}
                checkOut={bookingData.checkOut}
                onChange={handleChange}
                disabledDates={disabledDates}
              />
            </div>

            {/* campo de huespedes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Huéspedes
              </label>
              <Select onValueChange={(v) => handleChange("huespedes", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="2 Adultos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adulto</SelectItem>
                  <SelectItem value="2">2 Adultos</SelectItem>
                  <SelectItem value="3">3 Adultos</SelectItem>
                  <SelectItem value="4">4 Adultos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-900">
              <span>
                ${pricePerNight.toLocaleString()} × {nights} noche
                {nights !== 1 ? "s" : ""}
              </span>
              <span>${total.toLocaleString()}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Buscando..." : "Verificar disponibilidad"}
          </Button>
          <p className="text-xs text-resort-slate text-center mt-4">
            Aún no se realizará ningún cargo
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            ¿Necesitás ayuda?
          </h4>
          <p className="text-sm text-resort-slate mb-4">
            Nuestro equipo de concierge está disponible 24/7 para ayudarte a
            planificar la estadía perfecta.
          </p>
          <Button variant="outline" className="w-full bg-transparent">
            Contactar concierge
          </Button>
        </CardContent>
      </Card>

      {/* modal de disponibilidad */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availabilityData={availabilityData}
        onConfirmReservation={handleConfirmReservation}
        onSelectAlternativeDate={handleSelectAlternativeDate}
        isLoading={isLoading}
        user={user}
      />

      {/* modal de confirmacion exitosa */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        reservationData={confirmedReservation}
      />

      {/* modal de login requerido */}
      <LoginRequiredModal
        isOpen={isLoginRequiredModalOpen}
        onClose={() => setIsLoginRequiredModalOpen(false)}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToRegister={handleNavigateToRegister}
      />
    </div>
  );
}
