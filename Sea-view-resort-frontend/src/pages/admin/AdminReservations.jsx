import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import {
  Calendar,
  Search,
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiUrl } from "../../services/http";
import axios from "axios";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar reservas reales desde el backend
  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(apiUrl("/api/reservas"), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data.datos || response.data || [];
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast.error("Error al cargar las reservas");
      setReservations([]);
      setFilteredReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filtrar reservas
  useEffect(() => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter((reservation) => {
        const userName =
          reservation.userId?.username || reservation.userId?.email || "";
        const roomName = reservation.roomId?.name || "";
        return (
          userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.destino?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm]);

  const handleDelete = async (reservationId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      try {
        await axios.delete(apiUrl(`/api/reservas/${reservationId}`), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setReservations((prev) => prev.filter((r) => r._id !== reservationId));
        toast.success("Reserva eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        toast.error("Error al eliminar la reserva");
      }
    }
  };

  const getStatusBadge = (checkIn, checkOut) => {
    // Comparar solo las fechas (YYYY-MM-DD) para evitar problemas de timezone
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const checkInDate = checkIn.split("T")[0];
    const checkOutDate = checkOut.split("T")[0];

    if (checkOutDate < todayStr) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
          Pasada
        </span>
      );
    } else if (checkInDate <= todayStr && checkOutDate > todayStr) {
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
  };

  // Calcular estadísticas
  const stats = {
    total: reservations.length,
    activas: reservations.filter((r) => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const checkIn = r.checkIn.split("T")[0];
      const checkOut = r.checkOut.split("T")[0];
      return checkIn <= todayStr && checkOut > todayStr;
    }).length,
    proximas: reservations.filter((r) => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const checkIn = r.checkIn.split("T")[0];
      return checkIn > todayStr;
    }).length,
    pasadas: reservations.filter((r) => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const checkOut = r.checkOut.split("T")[0];
      return checkOut < today;
    }).length,
  };

  const formatPrice = (price) => {
    if (price == null || Number.isNaN(Number(price))) return "$0";
    const formatted = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
    }).format(price);
    return formatted.replace("US$", "$").replace("USD", "$");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Fecha inválida";

    // Usar componentes UTC para evitar problemas de timezone
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Reservas
            </h1>
            <p className="text-gray-600 mt-1">
              {reservations.length} reservas totales en el sistema
            </p>
          </div>
          <Button
            onClick={fetchReservations}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.activas}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próximas</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.proximas}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pasadas</p>
                <p className="text-3xl font-bold text-gray-600">
                  {stats.pasadas}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por usuario, habitación o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de reservas */}
      <Card>
        <CardContent className="pt-6">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No hay reservas para mostrar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Usuario
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Habitación
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Check-in
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Check-out
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Huéspedes
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {reservation.userId?.username ||
                              "Usuario desconocido"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reservation.userId?.email || ""}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-gray-900">
                          {reservation.roomId?.name || "Habitación eliminada"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {reservation.destino}
                        </p>
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {formatDate(reservation.checkIn)}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {formatDate(reservation.checkOut)}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {reservation.huespedes}
                      </td>
                      <td className="p-3 text-sm font-semibold text-gray-900">
                        {formatPrice(reservation.total)}
                      </td>
                      <td className="p-3">
                        {getStatusBadge(
                          reservation.checkIn,
                          reservation.checkOut,
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reservation._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
