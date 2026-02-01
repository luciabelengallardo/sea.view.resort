import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import {
  Calendar,
  Bed,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Plus,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminAvailability() {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    specialRequests: ''
  });

  // Simular datos de disponibilidad
  useEffect(() => {
    const mockAvailability = [
      {
        id: 1,
        roomNumber: '101',
        roomType: 'Standard',
        capacity: 2,
        status: 'available',
        currentGuest: null,
        checkIn: null,
        checkOut: null,
        price: 150,
        amenities: ['WiFi', 'TV', 'A/C']
      },
      {
        id: 2,
        roomNumber: '102',
        roomType: 'Standard',
        capacity: 2,
        status: 'occupied',
        currentGuest: 'María González',
        checkIn: '2025-08-20',
        checkOut: '2025-08-25',
        price: 150,
        amenities: ['WiFi', 'TV', 'A/C']
      },
      {
        id: 3,
        roomNumber: '201',
        roomType: 'Deluxe',
        capacity: 3,
        status: 'available',
        currentGuest: null,
        checkIn: null,
        checkOut: null,
        price: 250,
        amenities: ['WiFi', 'TV', 'A/C', 'Balcony', 'Ocean View']
      },
      {
        id: 4,
        roomNumber: '202',
        roomType: 'Deluxe',
        capacity: 3,
        status: 'maintenance',
        currentGuest: null,
        checkIn: null,
        checkOut: null,
        price: 250,
        amenities: ['WiFi', 'TV', 'A/C', 'Balcony', 'Ocean View']
      },
      {
        id: 5,
        roomNumber: '301',
        roomType: 'Suite',
        capacity: 4,
        status: 'available',
        currentGuest: null,
        checkIn: null,
        checkOut: null,
        price: 400,
        amenities: ['WiFi', 'TV', 'A/C', 'Balcony', 'Ocean View', 'Kitchen', 'Jacuzzi']
      },
      {
        id: 6,
        roomNumber: '302',
        roomType: 'Suite',
        capacity: 4,
        status: 'occupied',
        currentGuest: 'Carlos Rodríguez',
        checkIn: '2025-08-22',
        checkOut: '2025-08-24',
        price: 400,
        amenities: ['WiFi', 'TV', 'A/C', 'Balcony', 'Ocean View', 'Kitchen', 'Jacuzzi']
      },
      {
        id: 7,
        roomNumber: '401',
        roomType: 'Suite',
        capacity: 4,
        status: 'reserved',
        currentGuest: null,
        checkIn: '2025-08-28',
        checkOut: '2025-09-02',
        price: 400,
        amenities: ['WiFi', 'TV', 'A/C', 'Balcony', 'Ocean View', 'Kitchen', 'Jacuzzi']
      },
      {
        id: 8,
        roomNumber: '402',
        roomType: 'Deluxe',
        capacity: 3,
        status: 'available',
        currentGuest: null,
        checkIn: null,
        checkOut: null,
        price: 250,
        amenities: ['WiFi', 'TV', 'A/C', 'Balcony', 'Ocean View']
      }
    ];

    setAvailabilityData(mockAvailability);
    setFilteredData(mockAvailability);
    setIsLoading(false);
  }, []);

  // Filtrar datos
  useEffect(() => {
    let filtered = availabilityData;

    // Filtrar por tipo de habitación
    if (roomTypeFilter !== 'all') {
      filtered = filtered.filter(room => room.roomType === roomTypeFilter);
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(room => room.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [availabilityData, roomTypeFilter, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'occupied': return <XCircle className="w-4 h-4" />;
      case 'reserved': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <Eye className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatistics = () => {
    const total = availabilityData.length;
    const available = availabilityData.filter(r => r.status === 'available').length;
    const occupied = availabilityData.filter(r => r.status === 'occupied').length;
    const reserved = availabilityData.filter(r => r.status === 'reserved').length;
    const maintenance = availabilityData.filter(r => r.status === 'maintenance').length;

    return { total, available, occupied, reserved, maintenance };
  };

  const stats = getStatistics();

  const handleCreateReservation = (room) => {
    setSelectedRoom(room);
    setReservationForm({
      guestName: '',
      email: '',
      phone: '',
      checkIn: '2025-08-20',
      checkOut: '2025-08-25',
      guests: '2',
      specialRequests: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveReservation = async () => {
    try {
      // Validar campos obligatorios
      if (!reservationForm.guestName || !reservationForm.email || !reservationForm.phone) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      // Simular creación de reserva
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (selectedRoom.id === 'new') {
        // Crear nueva reserva sin habitación específica
        toast.success('Reserva creada exitosamente (sin habitación asignada)');
      } else {
        // Actualizar el estado de la habitación existente
        setAvailabilityData(prev => prev.map(room =>
          room.id === selectedRoom.id
            ? {
              ...room,
              status: 'reserved',
              currentGuest: reservationForm.guestName,
              checkIn: reservationForm.checkIn,
              checkOut: reservationForm.checkOut
            }
            : room
        ));
        toast.success('Reserva creada exitosamente');
      }

      setIsModalOpen(false);
      setSelectedRoom(null);
      setReservationForm({
        guestName: '',
        email: '',
        phone: '',
        checkIn: '2025-08-20',
        checkOut: '2025-08-25',
        guests: '2',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      toast.error('Error al crear la reserva');
    }
  };

  const handleChangeStatus = async (roomId, newStatus) => {
    try {
      // Simular actualización de estado
      await new Promise(resolve => setTimeout(resolve, 500));

      setAvailabilityData(prev => prev.map(room =>
        room.id === roomId
          ? {
            ...room,
            status: newStatus,
            currentGuest: newStatus === 'available' ? null : room.currentGuest,
            checkIn: newStatus === 'available' ? null : room.checkIn,
            checkOut: newStatus === 'available' ? null : room.checkOut
          }
          : room
      ));

      toast.custom(
        <div className="max-w-sm w-full bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow p-3 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Actualización</p>
            <p>Estado de habitación actualizado a: {getStatusText(newStatus)}</p>
          </div>
        </div>,
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Disponibilidad de Habitaciones</h1>
        <p className="text-gray-600">Estado en tiempo real de todas las habitaciones</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="2025-08-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de habitación</label>
              <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="occupied">Ocupada</SelectItem>
                  <SelectItem value="reserved">Reservada</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setRoomTypeFilter('all');
                  setStatusFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                Limpiar filtros
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedRoom({
                    id: 'new',
                    roomNumber: 'Nueva',
                    roomType: 'Standard',
                    capacity: 2,
                    price: 150,
                    amenities: ['WiFi', 'TV', 'A/C']
                  });
                  setReservationForm({
                    guestName: '',
                    email: '',
                    phone: '',
                    checkIn: '2025-08-20',
                    checkOut: '2025-08-25',
                    guests: '2',
                    specialRequests: ''
                  });
                  setIsModalOpen(true);
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Reserva
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Habitaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Bed className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupadas</p>
                <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reservadas</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.reserved}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mantenimiento</p>
                <p className="text-2xl font-bold text-gray-600">{stats.maintenance}</p>
              </div>
              <Eye className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de habitaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Habitaciones - {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((room) => (
              <Card key={room.id} className={`border-2 ${room.status === 'available' ? 'border-green-200' :
                room.status === 'occupied' ? 'border-red-200' :
                  room.status === 'reserved' ? 'border-yellow-200' :
                    'border-gray-200'
                }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Habitación {room.roomNumber}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                      {getStatusIcon(room.status)}
                      {getStatusText(room.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{room.roomType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Capacidad: {room.capacity} personas</span>
                    </div>

                    <div className="font-medium text-green-600">
                      {formatPrice(room.price)} / noche
                    </div>

                    {room.currentGuest && (
                      <div className="mt-3 p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Huésped actual:</p>
                        <p className="font-medium">{room.currentGuest}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs">
                            {room.checkIn} - {room.checkOut}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {room.status === 'available' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleCreateReservation(room)}
                      >
                        <Plus className="w-4 h-4" />
                        Crear Reserva
                      </Button>
                    )}

                    {room.status !== 'available' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleChangeStatus(room.id, 'available')}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar Disponible
                      </Button>
                    )}

                    <Select
                      value={room.status}
                      onValueChange={(value) => handleChangeStatus(room.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="reserved">Reservada</SelectItem>
                        <SelectItem value="occupied">Ocupada</SelectItem>
                        <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal para crear reserva */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {selectedRoom.id === 'new' ? 'Nueva Reserva' : `Crear Reserva - Habitación ${selectedRoom.roomNumber}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del huésped *</label>
                  <Input
                    value={reservationForm.guestName}
                    onChange={(e) => setReservationForm({ ...reservationForm, guestName: e.target.value })}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={reservationForm.email}
                    onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono *</label>
                  <Input
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                    placeholder="+34 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Número de huéspedes</label>
                  <Select value={reservationForm.guests} onValueChange={(value) => setReservationForm({ ...reservationForm, guests: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <Input
                    type="date"
                    value={reservationForm.checkIn}
                    onChange={(e) => setReservationForm({ ...reservationForm, checkIn: e.target.value })}
                    min="2025-08-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <Input
                    type="date"
                    value={reservationForm.checkOut}
                    onChange={(e) => setReservationForm({ ...reservationForm, checkOut: e.target.value })}
                    min="2025-08-21"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Solicitudes especiales</label>
                <textarea
                  value={reservationForm.specialRequests}
                  onChange={(e) => setReservationForm({ ...reservationForm, specialRequests: e.target.value })}
                  placeholder="Solicitudes especiales o comentarios..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows="3"
                />
              </div>

              {selectedRoom.id !== 'new' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Detalles de la habitación:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Habitación:</span>
                      <p className="font-medium">{selectedRoom.roomNumber} - {selectedRoom.roomType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Precio por noche:</span>
                      <p className="font-medium">{formatPrice(selectedRoom.price)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacidad:</span>
                      <p className="font-medium">{selectedRoom.capacity} personas</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Amenities:</span>
                      <p className="font-medium">{selectedRoom.amenities.join(', ')}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveReservation}
                  className="flex-1"
                >
                  Crear Reserva
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
