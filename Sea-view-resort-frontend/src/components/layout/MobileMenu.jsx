import { useEffect } from "react";
import { Link } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getInitials } from "../../lib/formatters";

const navItems = [
  { name: "Inicio", to: "/" },
  { name: "Explorar", to: "/explore" },
  { name: "Habitaciones", to: "/rooms" },
  { name: "Nosotros", to: "/about" },
  { name: "Contacto", to: "/contact" },
];

export default function MobileMenu({ isOpen, onClose, user, logout }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <div
        className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={onClose}
              aria-label="Sea View Resort"
              className="inline-flex items-baseline leading-none select-none"
            >
              <span className="font-display text-resort-olive text-xl tracking-wide">
                Sea View
              </span>
              <span className="font-display text-resort-olive/90 text-xs tracking-[0.35em] ml-2 uppercase">
                Resort
              </span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-700 hover:text-resort-olive font-medium"
              onClick={onClose}
            >
              {item.name}
            </Link>
          ))}
          <Link to="/rooms" onClick={onClose}>
            <Button className="mt-5 rounded-full px-6">Reservar</Button>
          </Link>
        </div>
        <div className="mt-6 border-t pt-4 flex flex-col gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center">
                  <span className="font-semibold text-sm uppercase">
                    {getInitials(user.username || user.email || "")}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  Bienvenido, {user.username}
                </span>
              </div>
              <Button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full"
                radius="full"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Link to="/login" onClick={onClose} className="w-full">
              <Button className="w-full flex items-center gap-2 justify-center">
                <UserIcon className="w-4 h-4" /> Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
