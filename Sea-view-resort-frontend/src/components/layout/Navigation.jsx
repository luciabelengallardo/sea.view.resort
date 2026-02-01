import { NavLink } from "react-router-dom";
import { classNames } from "../../lib/classNames";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { name: "Inicio", to: "/" },
  { name: "Explorar", to: "/explore" },
  { name: "Habitaciones", to: "/rooms" },
  { name: "Nosotros", to: "/about" },
  { name: "Contacto", to: "/contact" },
  { name: "Administrador", to: "/admin" },
];

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
      {navItems
        .filter((item) => {
          if (item.name === "Administrador") {
            return user?.role === "admin";
          }
          return true;
        })
        .map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(
                "font-medium transition-colors",
                isActive
                  ? "text-resort-olive"
                  : "text-gray-700 hover:text-resort-olive"
              )
            }
            end={item.to === "/"}
          >
            {item.name}
          </NavLink>
        ))}
    </nav>
  );
}
