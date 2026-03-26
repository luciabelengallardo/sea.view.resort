import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/formatters";
import { User as UserIcon } from "lucide-react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleAdmin = () => {
    setOpen(false);
    navigate("/admin");
  };

  const avatarContent = user ? getInitials(user.email || "") : "";

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label={
          user ? "Abrir menú de usuario" : "Abrir menú de inicio de sesión"
        }
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center select-none hover:border-resort-olive hover:text-resort-olive transition-colors"
      >
        {user ? (
          <span className="font-semibold text-sm uppercase">
            {avatarContent}
          </span>
        ) : (
          <UserIcon className="w-5 h-5" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <p className="font-medium truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mis Reservas
              </button>
              {user.role === "admin" && (
                <button
                  onClick={handleAdmin}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-resort-olive hover:bg-gray-100"
                >
                  Panel Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </div>
  );
}
