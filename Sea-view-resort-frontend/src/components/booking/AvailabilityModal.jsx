import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Modal from '../ui/Modal';
import { X, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate, formatPrice } from '../../lib/formatters';
import AlternativeDatesCalendar from './AlternativeDatesCalendar';

export default function AvailabilityModal({ isOpen, onClose, availabilityData, onConfirmReservation, onSelectAlternativeDate, isLoading: externalLoading, user }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmReservation = async () => {
        setIsLoading(true);
        try {
            await onConfirmReservation(availabilityData);
            // No cerramos el modal aquí, se cerrará cuando se muestre el modal de éxito
        } catch (error) {
            console.error('Error al confirmar la reserva:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Modal open={isOpen} onClose={onClose} size="md" lockScroll trapFocus>
            <Card className="relative w-full max-h-[90vh] overflow-y-auto">
                {/* Botón de cerrar en esquina superior derecha */}
                <div className="absolute top-3 right-3 z-20">
                    <Button
                        variant="ghost"
                        size="sm"
                        radius="full"
                        onClick={onClose}
                        className="h-8 w-8 p-0 shadow-sm focus:ring-0 focus:ring-offset-0"
                    >
                        <X className="h-4 w-4" strokeWidth={3} />
                    </Button>
                </div>
                {externalLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Buscando disponibilidad...</p>
                        </div>
                    </div>
                )}
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-center">
                        Disponibilidad de Habitación
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Información de la búsqueda */}
                    <div className="bg-gray-50 p-3 rounded-lg mx-auto w-full max-w-3xl">
                        <h3 className="font-medium text-gray-900 mb-1">Detalles de la búsqueda:</h3>
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="font-semibold">Check-in:</span>
                                <span>{formatDate(availabilityData?.checkIn)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="font-semibold">Check-out:</span>
                                <span>{formatDate(availabilityData?.checkOut)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Habitación:</span>
                                <span>{availabilityData?.habitacion}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Huéspedes:</span>
                                <span>{availabilityData?.huespedes}</span>
                            </div>
                        </div>
                    </div>

                    {/* Resultado de disponibilidad */}
                    {availabilityData?.disponible ? (
                        <div className="space-y-4">
                            <div className="mx-auto w-full max-w-3xl">
                                <div className="flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-2xl shadow-sm text-center">
                                    <div className="text-center">
                                        <h3 className="font-semibold text-green-800 text-base">¡Habitación disponible!</h3>
                                        <p className="text-green-700 text-xs">
                                            La habitación está disponible para las fechas seleccionadas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Información de precio */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-1">Información de precio:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Precio por noche:</span>
                                        <span className="font-medium">{formatPrice(availabilityData?.precioPorNoche || 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Noches:</span>
                                        <span className="font-medium">{availabilityData?.noches || 0}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                        <span>Total:</span>
                                        <span className="text-blue-900">{formatPrice(availabilityData?.precioTotal || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Información de autenticación */}
                            {!user && (
                                <div role="alert" aria-live="polite" className="w-full max-w-3xl mx-auto">
                                    <div className="flex items-start gap-3 p-4 rounded-2xl border bg-red-50 border-red-200 shadow-sm">
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
                                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-red-900 font-semibold text-base leading-6">Inicia sesión para confirmar</h3>
                                            <p className="mt-1 text-red-800 text-sm">
                                                Necesitas estar logueado para confirmar tu reserva. Al hacer clic en «Confirmar Reserva» serás redirigido a la página de login.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botón de confirmar */}
                            <div className="flex gap-2 pt-3">
                                <Button
                                    onClick={handleConfirmReservation}
                                    disabled={isLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    {isLoading ? 'Confirmando...' : user ? 'Confirmar Reserva' : 'Iniciar Sesión'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="mx-auto w-full max-w-3xl">
                                <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-2xl shadow-sm text-center">
                                    <div className="text-center">
                                        <h3 className="font-semibold text-red-800 text-lg">Habitación no disponible</h3>
                                        <p className="text-red-700 text-sm">La habitación no está disponible para las fechas seleccionadas</p>
                                    </div>
                                </div>
                            </div>

                            {/* Días disponibles alternativos */}
                            {availabilityData?.diasDisponibles && availabilityData.diasDisponibles.length > 0 && (
                                <div className="p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Fechas alternativas disponibles:
                                    </h4>
                                    <AlternativeDatesCalendar
                                        asModal={false}
                                        isOpen
                                        dates={availabilityData?.diasDisponibles || []}
                                        onSelect={(d) => onSelectAlternativeDate(d)}
                                        title="Selecciona una fecha alternativa"
                                        compact
                                    />
                                </div>
                            )}

                            
                        </div>
                    )}
                </CardContent>
            </Card>
        </Modal>
    );
}


