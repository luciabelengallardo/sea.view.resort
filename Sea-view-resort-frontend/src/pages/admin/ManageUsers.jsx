import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../services/http";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import PageHeader from "../../components/admin/PageHeader";
import StatsGrid from "../../components/admin/StatsGrid";
import StatsCard from "../../components/admin/StatsCard";
import {
  Users,
  Shield,
  User,
  CheckCircle,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(apiUrl("/api/v1/users"), {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await deleteUser(userToDelete._id);
    closeDeleteModal();
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(apiUrl(`/api/v1/users/${id}`), {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(users.filter((e) => e._id !== id));
    } catch (err) {
      console.log(error);
      toast.error("Error al eliminar el usuario");
    }
  };

  // Reemplazamos la confirmación con un modal dedicado
  const confirmDelete = (id) => {
    const user = users.find((u) => u._id === id);
    if (user) openDeleteModal(user);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        apiUrl(`/api/v1/users/${editingUser._id}`),
        formData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setUsers(
        users.map((e) => (e._id === editingUser._id ? res.data.user : e))
      );
      setEditingUser(null);
      toast.success("Usuario actualizado correctamente");
    } catch (err) {
      console.log(err);
      toast.error("Error al actualizar usuario");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const initialsFor = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0) ?? "";
    const second = parts.length > 1 ? parts[1].charAt(0) : "";
    return (first + second).toUpperCase();
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  // Estadísticas calculadas
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const regularUsers = users.filter((u) => u.role === "user").length;
  const activeUsers = users.filter((u) => u.isActive !== false).length; // Asumiendo que existe esta propiedad

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Panel de Administración - Usuarios"
        subtitle={`Gestiona todos los usuarios del sistema • ${totalUsers} usuario${
          totalUsers !== 1 ? "s" : ""
        } registrado${totalUsers !== 1 ? "s" : ""}`}
      />

      {/* Estadísticas */}
      <StatsGrid>
        <StatsCard
          label="Total Usuarios"
          value={totalUsers}
          icon={Users}
          iconColor="text-green-600"
        />
        <StatsCard
          label="Administradores"
          value={adminUsers}
          icon={Shield}
          iconColor="text-purple-600"
          valueColor="text-purple-600"
        />
        <StatsCard
          label="Usuarios Regulares"
          value={regularUsers}
          icon={User}
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
        <StatsCard
          label="Usuarios Activos"
          value={activeUsers}
          icon={CheckCircle}
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
      </StatsGrid>

      {/* Tabla de usuarios */}
      <Card className="w-full mb-8">
        <div className="flex flex-col space-y-1.5 px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email o rol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <CardContent className="pt-4">
          <div style={{ maxHeight: "47vh" }} className="overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-4 font-medium">Usuario</th>
                    <th className="text-left px-6 py-4 font-medium">Email</th>
                    <th className="text-left px-6 py-4 font-medium">Rol</th>
                    <th className="text-left px-6 py-4 font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const initials = initialsFor(user.username);
                    return (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                              {initials ||
                                user.username?.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-medium">{user.username}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {user.role === "admin" && (
                              <Shield className="w-3 h-3 mr-1" />
                            )}
                            {user.role === "user" && (
                              <User className="w-3 h-3 mr-1" />
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {user.role !== "admin" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => confirmDelete(user._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Editar Usuario</h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Usuario</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userToDelete && (
        <Modal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          size="sm"
          lockScroll
          trapFocus
        >
          <Card className="w-full">
            <CardContent className="space-y-4 p-4">
              <p>
                ¿Estás seguro de que quieres eliminar a {userToDelete.username}?
              </p>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={closeDeleteModal}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleConfirmDelete}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </Modal>
      )}
    </div>
  );
}
