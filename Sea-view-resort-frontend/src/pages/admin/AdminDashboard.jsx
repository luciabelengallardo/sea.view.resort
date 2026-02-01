import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Calendar,
  Bed,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import AdminReservations from "./AdminReservations";
import AdminAvailability from "./AdminAvailability";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reservations");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: "reservations",
      label: "Reservas",
      icon: Calendar,
      description: "Gestionar reservas",
    },
    {
      id: "availability",
      label: "Disponibilidad",
      icon: Bed,
      description: "Estado de habitaciones",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "reservations":
        return <AdminReservations />;
      case "availability":
        return <AdminAvailability />;
      default:
        return <AdminReservations />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">Sea View Resort</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:shadow-none
        `}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">
                            {item.description}
                          </div>
                        </div>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="text-xs text-gray-500">
                <p>© 2025 Sea View Resort</p>
                <p>Panel de Administración</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content */}
          <div className="min-h-screen">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
