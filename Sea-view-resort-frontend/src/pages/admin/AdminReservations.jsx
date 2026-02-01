import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import PageHeader from '../../components/admin/PageHeader';
import StatsGrid from '../../components/admin/StatsGrid';
import StatsCard from '../../components/admin/StatsCard';
import {
  Calendar,
  Users,
  Bed,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useRooms } from '../../context/RoomsContext';
import { toast } from 'react-hot-toast';

export default function AdminReservations() {
  const { rooms } = useRooms();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    guests: '',
    status: 'confirmed',
    specialRequests: ''
  });

  // Simular datos de reservas para demostración usando habitaciones del contexto
  useEffect(() => {
    if (rooms.length === 0) return; // Esperar a que las habitaciones se carguen

    const extraGuests = [
      { name: 'María González', email: 'maria@email.com', phone: '+34 123 456 789' },
      { name: 'Carlos Rodríguez', email: 'carlos@email.com', phone: '+34 987 654 321' },
      { name: 'Ana Martínez', email: 'ana@email.com', phone: '+34 555 123 456' },
      { name: 'Luis Fernández', email: 'luis@email.com', phone: '+34 777 888 999' },
      { name: 'Sofía García', email: 'sofia@email.com', phone: '+34 111 222 333' },
      { name: 'Miguel López', email: 'miguel@email.com', phone: '+34 444 555 666' },
      { name: 'Isabel Ruiz', email: 'isabel@email.com', phone: '+34 333 444 555' },
      { name: 'Pablo Méndez', email: 'pablo@email.com', phone: '+34 222 333 444' },
      { name: 'Clara Campos', email: 'clara@email.com', phone: '+34 999 888 777' },
      { name: 'Daniel Vega', email: 'daniel@example.com', phone: '+34 101 202 303' },
      { name: 'Laura Ramos', email: 'laura@example.com', phone: '+34 404 505 606' },
      { name: 'Santiago Ruiz', email: 'santiago@example.com', phone: '+34 505 606 707' },
      { name: 'Fernanda Soto', email: 'fernanda@example.com', phone: '+34 606 707 808' },
      { name: 'Marco Diaz', email: 'marco@example.com', phone: '+34 707 808 909' }
    ];

    const mockReservations = [];
    const totalToCreate = Math.max(rooms.length * 10, 60); // más pruebas de scroll

    for (let i = 0; i < totalToCreate; i++) {
      const room = rooms[i % rooms.length];
      const guest = extraGuests[i % extraGuests.length];
      const base = new Date('2025-08-15');
      base.setDate(base.getDate() + i); // fechas escalonadas
      const nights = (i % 5) + 2; // 2-6 noches
      const checkIn = new Date(base);
      const checkOut = new Date(base);
      checkOut.setDate(checkOut.getDate() + nights);
      const totalPrice = room.price * nights;

      mockReservations.push({
        id: i + 1,
        guestName: guest.name,
        email: guest.email,
        phone: guest.phone,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        roomType: room.name,
        guests: ((i % 4) + 1),
        status: ['confirmed', 'pending', 'cancelled'][i % 3],
        specialRequests: i % 3 === 0 ? 'Vista al mar' : '',
        totalPrice,
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      });
    }

    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
    setIsLoading(false);
  }, [rooms]); // Dependencia en rooms para que se actualice cuando cambien las habitaciones

  // Filtrar reservas
  useEffect(() => {
    let filtered = reservations;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter]);

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      guestName: reservation.guestName,
      email: reservation.email,
      phone: reservation.phone,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      roomType: reservation.roomType,
      guests: reservation.guests.toString(),
      status: reservation.status,
      specialRequests: reservation.specialRequests
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        // Simular llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setReservations(prev => prev.filter(r => r.id !== reservationId));
        toast.success('Reserva eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        toast.error('Error al eliminar la reserva');
      }
    }
  };

  const handleSave = async () => {
    try {
      // Validar campos obligatorios
      if (!formData.guestName || !formData.email || !formData.phone || !formData.roomType) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      // Validar que la habitación seleccionada existe en el contexto
      const selectedRoom = rooms.find(r => r.name === formData.roomType);
      if (!selectedRoom) {
        alert('La habitación seleccionada no existe en el sistema');
        return;
      }

      if (editingReservation) {
        // Simular actualización
        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalPrice = calculateTotalPrice(formData.roomType, formData.checkIn, formData.checkOut);

        setReservations(prev => prev.map(r =>
          r.id === editingReservation.id
            ? { ...r, ...formData, guests: parseInt(formData.guests), totalPrice }
            : r
        ));
        toast.success('Reserva actualizada exitosamente');
      } else {
        // Simular creación
        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalPrice = calculateTotalPrice(formData.roomType, formData.checkIn, formData.checkOut);

        const newReservation = {
          id: Date.now(),
          ...formData,
          guests: parseInt(formData.guests),
          totalPrice,
          createdAt: new Date().toISOString().split('T')[0]
        };

        setReservations(prev => [...prev, newReservation]);
        toast.success('Reserva creada exitosamente');
      }

      setIsModalOpen(false);
      setEditingReservation(null);
      setFormData({
        guestName: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        roomType: '',
        guests: '',
        status: 'confirmed',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      toast.error('Error al guardar la reserva');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatPrice = (price) => {
    const formatted = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol'
    }).format(price);
    return formatted.replace('US$', '$').replace('USD', '$');
  };

  // Función para obtener el precio de la habitación seleccionada
  const getRoomPrice = (roomName) => {
    const room = rooms.find(r => r.name === roomName);
    return room ? room.price : 0;
  };

  // Función para calcular el precio total de la reserva
  const calculateTotalPrice = (roomType, checkIn, checkOut) => {
    if (!roomType || !checkIn || !checkOut) return 0;

    const pricePerNight = getRoomPrice(roomType);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return pricePerNight * nights;
  };

  if (isLoading || rooms.length === 0) {
    return (
      <div className="flex-y flex items-center justify-center h-screen overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {rooms.length === 0 ? 'Cargando habitaciones...' : 'Cargando reservas...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Panel de Administración - Reservas"
        subtitle={`Gestiona todas las reservas del hotel • ${rooms.length} habitación${rooms.length !== 1 ? 'es' : ''} disponible${rooms.length !== 1 ? 's' : ''} en el sistema`}
      />

      {/* Estadísticas */}
      <StatsGrid>
        <StatsCard
          label="Total Reservas"
          value={reservations.length}
          icon={Calendar}
          iconColor="text-green-600"
        />
        <StatsCard
          label="Confirmadas"
          value={reservations.filter(r => r.status === 'confirmed').length}
          icon={CheckCircle}
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
        <StatsCard
          label="Pendientes"
          value={reservations.filter(r => r.status === 'pending').length}
          icon={Clock}
          iconColor="text-yellow-600"
          valueColor="text-yellow-600"
        />
        <StatsCard
          label="Canceladas"
          value={reservations.filter(r => r.status === 'cancelled').length}
          icon={XCircle}
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
      </StatsGrid>

      {/* Tabla de reservas */}
      <Card className="w-full mb-8">
        <div className="flex flex-col space-y-1.5 px-6 pt-4">
          <div className="grid grid-cols-P md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, email o habitación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingReservation(null);
                  setFormData({
                    guestName: '',
                    email: '',
                    phone: '',
                    checkIn: '',
                    checkOut: '',
                    roomType: '',
                    guests: '',
                    status: 'confirmed',
                    specialRequests: ''
                  });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Reserva
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="pt-4">
          <div style={{ maxHeight: '47vh' }} className="overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 font-medium">Huésped</th>
                    <th className="text-left px-6 py-4 font-medium">Fechas</th>
                    <th className="text-left px-8 py-6 font-medium">Habitación</th>
                    <th className="text-left px-2 py-2 font-medium">Estado</th>
                    <th className="text-left px-6 py-4 font-medium">Precio</th>
                    <th className="text-left px-6 py-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{reservation.guestName}</p>
                          <p className="text-sm text-gray-600">{reservation.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm">{formatDate(reservation.checkIn)}</p>
                            <p className="text-sm text-gray-600">a {formatDate(reservation.checkOut)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{reservation.roomType}</p>
                            <p className="text-sm text-gray-600">{reservation.guests} huéspedes</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          {reservation.status === 'confirmed' && 'Confirmada'}
                          {reservation.status === 'pending' && 'Pendiente'}
                          {reservation.status === 'cancelled' && 'Cancelada'}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{formatPrice(reservation.totalPrice)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(reservation)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(reservation.id)}
                            className="text-red-600 hover:text-red-700"
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
          </div>
        </CardContent>
      </Card>

      {/* Modal para editar/crear reserva */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del huésped</label>
                  <Input
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <Input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    min="2025-08-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <Input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    min="2025-08-21"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de habitación</label>
                  <Select value={formData.roomType} onValueChange={(value) => setFormData({ ...formData, roomType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.length > 0 ? (
                        rooms.map((room) => (
                          <SelectItem key={room.id} value={room.name}>
                            {room.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No hay habitaciones disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Número de huéspedes</label>
                  <Select value={formData.guests} onValueChange={(value) => setFormData({ ...formData, guests: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Solicitudes especiales</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Solicitudes especiales o comentarios..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows="3"
                />
              </div>

              {/* Mostrar precio calculado */}
              {formData.roomType && formData.checkIn && formData.checkOut && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de Precios:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Precio por noche:</span>
                      <span className="font-medium">{formatPrice(getRoomPrice(formData.roomType))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Noches:</span>
                      <span className="font-medium">
                        {(() => {
                          const start = new Date(formData.checkIn);
                          const end = new Date(formData.checkOut);
                          const diffTime = Math.abs(end - start);
                          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        })()}
                      </span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatPrice(calculateTotalPrice(formData.roomType, formData.checkIn, formData.checkOut))}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1"
                >
                  {editingReservation ? 'Actualizar' : 'Crear'} Reserva
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
