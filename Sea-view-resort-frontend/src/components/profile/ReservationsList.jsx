import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
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

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(apiUrl("/api/reservas"), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReservations(response.data.datos || response.data || []);
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
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    try {
      await axios.delete(apiUrl(`/api/reservas/${reservationId}`), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReservations(reservations.filter(r => r._id !== reservationId));
      toast.success("Reserva cancelada exitosamente");
    } catch (err) {
      console.error("Error canceling reservation:", err);
      toast.error("Error al cancelar la reserva");
    }
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
                        Fechas
                      </p>
                      <p className="text-sm">
                        {formatDate(reservation.checkIn)} a{" "}
                        {formatDate(reservation.checkOut)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users className="size-4" />
                        Habitación
                      </p>
                      <p className="text-sm">{reservation.roomId?.name || "Habitación"}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users className="size-4" />
                        Huéspedes
                      </p>
                      <p className="text-sm">{reservation.huespedes || "-"} personas</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-4" />
                        Total
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatPrice(reservation.total || reservation.precioPorNoche)}
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
                      onClick={() => handleCancelReservation(reservation._id || reservation.id)}
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
