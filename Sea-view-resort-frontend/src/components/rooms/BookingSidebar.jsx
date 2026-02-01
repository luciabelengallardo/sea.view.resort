import { useState, useEffect } from "react";
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
import { checkAvailability } from "../../services/reserva";

/**
 * Sidebar de reserva con cálculo de costos.
 *
 * Encapsula UI y lógica de cálculo del resumen.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {number} props.pricePerNight - Precio por noche de la habitación.
 * @param {string} props.roomName - Nombre de la habitación.
 * @param {string} props.roomId - ID de la habitación.
 * @returns {JSX.Element}
 */
export default function BookingSidebar({ pricePerNight, roomName, roomId }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState({
    destino: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    })(),
    huespedes: "2",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);

  // Calcular noches
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const serviceFee = 25000;
  const taxes = 30000;
  const subtotal = pricePerNight * nights;
  const total = subtotal + serviceFee + taxes;

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
    if (!bookingData.destino) {
      alert("Por favor selecciona un destino");
      return;
    }

    setIsLoading(true);
    try {
      // Consultar disponibilidad en la API
      const availabilityResponse = await checkAvailability(
        roomId,
        bookingData.checkIn,
        bookingData.checkOut,
      );

      // Procesar la respuesta
      const mockData = {
        ...bookingData,
        habitacion: roomName,
        roomId: roomId,
        disponible:
          availabilityResponse.disponible || availabilityResponse.available,
        precioPorNoche: pricePerNight,
        noches: nights,
        precioTotal: total,
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
      console.log("Confirmando reserva:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConfirmedReservation(data);
      setIsSuccessModalOpen(true);
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
      const checkInDate = new Date(selectedDate);
      const originalCheckIn = new Date(bookingData.checkIn);
      const originalCheckOut = new Date(bookingData.checkOut);
      const nightsDiff = Math.ceil(
        (originalCheckOut - originalCheckIn) / (1000 * 60 * 60 * 24),
      );

      const newCheckOutDate = new Date(checkInDate);
      newCheckOutDate.setDate(checkInDate.getDate() + nightsDiff);

      const updatedBookingData = {
        ...bookingData,
        checkIn: selectedDate,
        checkOut: newCheckOutDate.toISOString().split("T")[0],
      };

      setBookingData(updatedBookingData);
      setIsLoading(true);

      // Consultar disponibilidad con las nuevas fechas
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
            {/* Campo de Destino */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Destino
              </label>
              <Select
                value={bookingData.destino}
                onValueChange={(v) => handleChange("destino", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maldivas">Maldivas</SelectItem>
                  <SelectItem value="bali">Bali</SelectItem>
                  <SelectItem value="hawai">Hawái</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fechas de Check-in y Check-out */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Check-in
                </label>
                <Input
                  type="date"
                  value={bookingData.checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleChange("checkIn", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Check-out
                </label>
                <Input
                  type="date"
                  value={bookingData.checkOut}
                  min={(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    return d.toISOString().split("T")[0];
                  })()}
                  onChange={(e) => handleChange("checkOut", e.target.value)}
                />
              </div>
            </div>

            {/* Campo de Huéspedes */}
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
                ${pricePerNight.toLocaleString()} × {nights} noches
              </span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-900">
              <span>Servicio</span>
              <span>${serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-900">
              <span>Impuestos</span>
              <span>${taxes.toLocaleString()}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            className={`w-full ${!bookingData.destino ? "opacity-50 cursor-not-allowed" : ""}`}
            size="lg"
            onClick={handleSearch}
            disabled={isLoading || !bookingData.destino}
          >
            {isLoading
              ? "Buscando..."
              : !bookingData.destino
                ? "Selecciona un destino"
                : "Verificar disponibilidad"}
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
    </div>
  );
}
