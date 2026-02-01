import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Modal from '../ui/Modal';
import { CheckCircle, X } from 'lucide-react';
import { formatDate, formatPrice } from '../../lib/formatters';
import { useNavigate } from 'react-router-dom';

export default function SuccessModal({ isOpen, onClose, reservationData }) {
    const navigate = useNavigate();

    const handleViewReservation = () => {
        onClose();
        navigate('/profile');
    };

    return (
        <Modal open={isOpen} onClose={onClose} size="sm" lockScroll trapFocus>
            <Card className="w-full">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-green-800">
                        ¡Reserva Confirmada!
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="absolute top-4 right-4 h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            Tu reserva ha sido confirmada exitosamente. Te hemos enviado un email con todos los detalles.
                        </p>
                    </div>

                    {/* Detalles de la reserva */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Detalles de tu reserva:</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Check-in:</span>
                                <span className="font-medium">{formatDate(reservationData?.checkIn)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Check-out:</span>
                                <span className="font-medium">{formatDate(reservationData?.checkOut)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Habitación:</span>
                                <span className="font-medium">{reservationData?.habitacion}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span className="font-medium text-green-600">{formatPrice(reservationData?.precioTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={onClose}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            Entendido
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleViewReservation}
                            className="flex-1"
                        >
                            Ver Reserva
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Modal>
    );
}


