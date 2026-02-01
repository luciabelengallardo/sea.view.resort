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

  const avatarContent = user ? getInitials(user.username || user.email || "") : "";

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label={user ? "Abrir menú de usuario" : "Abrir menú de inicio de sesión"}
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
              <div className="px-4 py-2 text-sm text-gray-700">
                Bienvenido, <span className="font-medium">{user.username}</span>
              </div>
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


