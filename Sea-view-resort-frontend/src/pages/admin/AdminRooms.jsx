import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRooms } from "../../context/RoomsContext";
import axios from "axios";
import {
  getRooms,
  crearRoom,
  updateRoom,
  deleteRoom,
  deleteImage,
} from "../../services/app.js";

export default function AdminRooms() {
  const { rooms, setRooms } = useRooms([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    images: [],
  });
  const [localImages, setLocalImages] = useState([]);
  const [confirmData, setConfirmData] = useState({
    open: false,
    action: null,
    message: "",
  });

  const API_URL = "http://localhost:4002";

  useEffect(() => {
    (async () => {
      const res = await getRooms();
      if (res.ok) {
        setRooms(Array.isArray(res.data) ? res.data : []);
      } else toast.error("Error al cargar habitaciones");
    })();
  }, []);

  // --- Modal ---
  const openModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        price: room.price,
        description: room.description,
        images: room.images || [],
      });
      setLocalImages([]); // limpiar previews locales
    } else {
      setEditingRoom(null);
      setFormData({ name: "", price: "", description: "", images: [] });
      setLocalImages([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (
      formData.name !== (editingRoom?.name || "") ||
      formData.price !== (editingRoom?.price || "") ||
      formData.description !== (editingRoom?.description || "") ||
      JSON.stringify(formData.images) !==
        JSON.stringify(editingRoom?.images || [])
    ) {
      setConfirmData({
        open: true,
        message: "Tienes cambios sin guardar, ¿quieres salir igualmente?",
        action: () => {
          setIsModalOpen(false);
          toast("Cambios descartados", { icon: "⚠️" });
        },
      });
    } else {
      setIsModalOpen(false);
    }
  };

  // --- Form ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setLocalImages([...localImages, { file, preview: previewURL }]);
  };

  const removeImage = async (img) => {
    const local = localImages.find((i) => i.preview === img);
    if (local) {
      setLocalImages(localImages.filter((i) => i.preview !== img));
      return;
    }

    // Si es imagen subida
    try {
      const res = await deleteImage(editingRoom._id, img);
      const updatedRoom = res?.data;
      if (!updatedRoom) throw new Error("Error al eliminar imagen");

      updatedRoom.images = updatedRoom.images.map((i) =>
        i.startsWith("http") ? i : `${API_URL}${i}`
      );

      setFormData({ ...formData, images: updatedRoom.images });
      setRooms(rooms.map((r) => (r._id === editingRoom._id ? updatedRoom : r)));
      setEditingRoom(updatedRoom);
      toast.success("Imagen eliminada");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar la imagen");
    }
  };
  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.description.trim()
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setConfirmData({
      open: true,
      message: "¿Quieres guardar los cambios?",
      action: async () => {
        try {
          let savedRoom;

          // Crear o actualizar habitación
          if (editingRoom) {
            const res = await updateRoom(editingRoom._id, {
              name: formData.name,
              price: formData.price,
              description: formData.description,
              images: formData.images,
            });
            if (res.ok) savedRoom = res.data?.datos || res.data;
          } else {
            const res = await crearRoom({
              name: formData.name,
              price: formData.price,
              description: formData.description,
              images: [],
            });
            if (res.ok) savedRoom = res.data?.datos || res.data;
          }

          if (!savedRoom) throw new Error("No se pudo guardar la habitación");

          // Subir imágenes nuevas
          for (const { file } of localImages) {
            const data = new FormData();
            data.append("images", file);

            const uploadRes = await axios.post(
              `${API_URL}/api/rooms/${savedRoom._id}/images`,
              data
            );
            savedRoom = uploadRes.data?.datos || uploadRes.data;
          }

          // Normalizar URLs
          savedRoom.images =
            savedRoom.images?.map((img) =>
              img.startsWith("http") ? img : `${API_URL}${img}`
            ) || [];

          // Actualizar contexto
          if (editingRoom) {
            setRooms(
              rooms.map((r) => (r._id === savedRoom._id ? savedRoom : r))
            );
            toast.success("Habitación actualizada");
          } else {
            setRooms([...rooms, savedRoom]);
            toast.success("Habitación agregada");
          }

          setFormData({
            name: "",
            price: "",
            description: "",
            images: savedRoom.images,
          });

          setIsModalOpen(false);
          setLocalImages([]);
        } catch (err) {
          console.error(err);
          toast.error("Error guardando habitación");
        }
      },
    });
  };

  // --- Eliminar habitación ---
  const handleDelete = (id) => {
    setConfirmData({
      open: true,
      message: "¿Seguro que deseas borrar esta habitación?",
      action: async () => {
        try {
          const res = await deleteRoom(id);
          if (res.ok) setRooms(rooms.filter((r) => r._id !== id));
          toast.success("Habitación eliminada");
        } catch (err) {
          console.error(err);
          toast.error("Error eliminando habitación");
        }
      },
    });
  };

  return (
    <div className="container py-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6">Gestión de Habitaciones</h1>

      <button
        onClick={() => openModal()}
        className="mb-6 bg-[rgb(150,130,96)] hover:bg-[rgb(150,130,96)/0.9] text-white px-4 py-2 rounded "
      >
        + Agregar Habitación
      </button>

      {/* Tabla Desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Precio</th>
              <th className="py-3 px-4">Descripción</th>
              <th className="py-3 px-4">Imagen</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(rooms) &&
              rooms.map((room) => (
                <tr key={room._id} className="border-t">
                  <td className="py-3 px-4">{room.name}</td>
                  <td className="py-3 px-4">${room.price}</td>
                  <td className="py-3 px-4">{room.description}</td>
                  <td className="py-3 px-4">
                    {room.images?.length > 0 ? (
                      <img
                        src={room.images[0]}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="flex flex-col gap-2 w-max">
                      <button
                        onClick={() => openModal(room)}
                        style={{ backgroundColor: "#968260" }}
                        className="text-white px-3 py-1 rounded hover:opacity-90"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        style={{ backgroundColor: "#ceb996" }}
                        className="text-white px-3 py-1 rounded hover:opacity-90"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="grid gap-4 md:hidden">
        {Array.isArray(rooms) &&
          rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold">{room.name}</h3>
              <p className="text-gray-600">Precio: ${room.price}</p>
              <p className="text-gray-500">{room.description}</p>
              {room.images?.length > 0 && (
                <img
                  src={room.images[0]}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded mt-2"
                />
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openModal(room)}
                  style={{ backgroundColor: "#968260" }}
                  className="text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  style={{ backgroundColor: "#ceb996" }}
                  className="text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingRoom ? "Editar Habitación" : "Nueva Habitación"}
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={formData.price}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <label className="block text-gray-700 font-medium mb-2">
                Subir imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded"
              />

              {/* Previews */}
              {localImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {localImages.map((img) => (
                    <div key={img.preview} className="relative">
                      <img
                        src={img.preview}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.preview)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Imágenes ya subidas */}
              {formData.images?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {formData.images.map((img) => (
                    <div key={img} className="relative">
                      <img
                        src={img}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded text-white bg-[rgb(150,130,96)] hover:bg-[rgb(150,130,96)/0.9]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmData.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <p className="mb-4">{confirmData.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmData({ open: false })}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  confirmData.action();
                  setConfirmData({ open: false });
                }}
                className="px-4 py-2 rounded text-white bg-[rgb(150,130,96)] hover:bg-[rgb(150,130,96)/0.9]"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
