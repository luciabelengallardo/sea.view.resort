import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Separator } from "../ui/separator";
import { Calendar, Users, DollarSign, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { formatDate, formatPrice } from "../../lib/formatters";
import axios from "axios";
import { apiUrl } from "../../services/http";
import { toast } from "react-hot-toast";

export function ReservationsList({ userId }) {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(apiUrl("/api/reservas"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const reservationsData = response.data.datos || response.data || [];
        setReservations(reservationsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("No se pudieron cargar las reservas");
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleCancelReservation = async (reservationId) => {
    toast.custom(
      (t) => (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Cancelar Reserva
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que deseas cancelar esta reserva? Esta acción
                no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    toast.dismiss(t.id);
                    try {
                      await axios.delete(
                        apiUrl(`/api/reservas/${reservationId}`),
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        },
                      );
                      setReservations(
                        reservations.filter((r) => r._id !== reservationId),
                      );
                      toast.success("Reserva cancelada exitosamente");
                    } catch (err) {
                      console.error("Error canceling reservation:", err);
                      toast.error("Error al cancelar la reserva");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  Cancelar reserva
                </Button>
                <Button
                  onClick={() => toast.dismiss(t.id)}
                  variant="outline"
                  size="sm"
                >
                  Mantener
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
      },
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Reservas</CardTitle>
          <CardDescription>Cargando tus reservas...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Reservas</CardTitle>
          <CardDescription>Error al cargar reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5" />
          Mis Reservas
        </CardTitle>
        <CardDescription>
          {reservations.length === 0
            ? "No tienes reservas aún"
            : `${reservations.length} reserva${reservations.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No tienes ninguna reserva. ¡Haz tu primera reserva ahora!
            </p>
            <Button>Explorar Habitaciones</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation._id || reservation.id}>
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="size-4" />
                        Desde
                      </p>
                      <p className="text-sm">
                        {formatDate(reservation.checkIn)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="size-4" />
                        Hasta
                      </p>
                      <p className="text-sm">
                        {formatDate(reservation.checkOut)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users className="size-4" />
                        Habitación
                      </p>
                      <p className="text-sm">
                        {reservation.roomId?.name || "Habitación"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users className="size-4" />
                        Huéspedes
                      </p>
                      <p className="text-sm">
                        {reservation.huespedes || "-"} personas
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-4" />
                        Total
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {(() => {
                          const total =
                            reservation.total ||
                            (reservation.precioPorNoche
                              ? reservation.precioPorNoche *
                                calculateNights(
                                  reservation.checkIn,
                                  reservation.checkOut,
                                )
                              : null);
                          return total ? `$${total.toFixed(2)}` : "N/A";
                        })()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Estado
                      </p>
                      <p className="text-sm">
                        {(() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const checkIn = new Date(reservation.checkIn);
                          checkIn.setHours(0, 0, 0, 0);
                          const checkOut = new Date(reservation.checkOut);
                          checkOut.setHours(0, 0, 0, 0);

                          if (checkOut < today) {
                            return (
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                                Pasada
                              </span>
                            );
                          } else if (checkIn <= today && checkOut >= today) {
                            return (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                                Activa
                              </span>
                            );
                          } else {
                            return (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                Próxima
                              </span>
                            );
                          }
                        })()}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      ID: {reservation._id?.substring(0, 8) || "N/A"}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleCancelReservation(
                          reservation._id || reservation.id,
                        )
                      }
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="size-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
