import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Modal from "../ui/Modal";
import { X, LogIn, UserPlus } from "lucide-react";

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onNavigateToLogin,
  onNavigateToRegister,
}) {
  return (
    <Modal open={isOpen} onClose={onClose} size="sm" lockScroll trapFocus>
      <Card className="w-full relative">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-center w-full">
            Inicia Sesión para Continuar
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            radius="full"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md ring-1 ring-black/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <LogIn className="w-9 h-9 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Ya casi estás ahí!
            </h3>
            <p className="text-gray-600 mb-2">
              Solo necesitas iniciar sesión para completar tu reserva.
            </p>
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta? Regístrate en segundos 🚀
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onNavigateToLogin}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>

            <Button
              onClick={onNavigateToRegister}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Crear Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </Modal>
  );
}
