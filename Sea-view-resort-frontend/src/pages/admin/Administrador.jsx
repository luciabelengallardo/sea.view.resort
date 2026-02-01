import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Bed,
  Calendar,
  Users,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import AdminReservations from "./AdminReservations";
import AdminRooms from "./AdminRooms";
import ManageUsers from "./ManageUsers";

export default function Administrador() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reservas");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "habitaciones",
      label: "Habitaciones",
      icon: Bed,

    },
    {
      id: "reservas",
      label: "Reservas",
      icon: Calendar,
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: Users,
    },
  ];

  const isReservationsView = activeTab === "reservas";

  const renderContent = () => {
    switch (activeTab) {
      case "habitaciones":
        return <AdminRooms />;
      case "reservas":
        return <AdminReservations />;
      case "usuarios":
        return <ManageUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            {/* Escudo de administración */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7 text-resort-olive ml-1 mr-1"
              aria-label="Escudo"
            >
              <path d="M12 2L3 6v6c0 5.2 3.5 9.6 9 11 5.5-1.4 9-5.8 9-11V6l-9-4z" />
            </svg>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">Sea View Resort</p>
            </div>
          </div>
          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <User className="w-5 h-5 text-resort-olive" />
            </Button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-resort-olive z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Flex container for sidebar and main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-200 ease-in-out h-full
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0 md:shadow-none
          `}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 p-6">
              <ul className="space-y-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-2 py-4 px-4 rounded-lg transition-colors ${isActive
                            ? "bg-resort-olive/10 hover:bg-resort-olive/20 text-resort-olive border border-resort-olive/20"
                            : "hover:bg-gray-50"
                          }`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-resort-olive" : "text-gray-600"}`} />
                        <div className="flex-1 text-left flex flex-col min-w-0">
                          <div className={`font-medium truncate ${isActive ? "text-resort-olive" : ""}`}>{item.label}</div>
                          <div className={`text-xs ${isActive ? "text-resort-olive/70" : "opacity-70"}`}>{item.description}</div>
                        </div>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="text-xs text-gray-500 text-center">
                <p>© 2025 Sea View Resort</p>
                <p>Panel de Administración</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-hidden">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content */}
          <div className="min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] p-6 overflow-auto">
            {renderContent() || (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">Cargando contenido...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
