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
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  const [imageUrl, setImageUrl] = useState("");
  const [confirmData, setConfirmData] = useState({
    open: false,
    action: null,
    message: "",
  });
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

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
      setImageUrl(""); // limpiar URL input
    } else {
      setEditingRoom(null);
      setFormData({ name: "", price: "", description: "", images: [] });
      setLocalImages([]);
      setImageUrl("");
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

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) {
      toast.error("Por favor ingresa una URL válida");
      return;
    }

    // Validar que sea una URL
    try {
      new URL(trimmedUrl);
    } catch {
      toast.error("URL inválida");
      return;
    }

    // Agregar directamente al formData.images
    const updatedImages = [...formData.images, trimmedUrl];
    console.log("🖼️ Agregando URL:", trimmedUrl);
    console.log("📋 Imágenes actualizadas:", updatedImages);

    setFormData({
      ...formData,
      images: updatedImages,
    });
    setImageUrl("");
    toast.success("URL agregada");
  };

  const removeImage = async (img) => {
    console.log("🗑️ Intentando eliminar:", img);

    // Si es un archivo local (preview)
    const local = localImages.find((i) => i.preview === img);
    if (local) {
      console.log("✅ Eliminando archivo local");
      setLocalImages(localImages.filter((i) => i.preview !== img));
      return;
    }

    // Si es una URL en formData.images pero NO está editando (habitación nueva)
    if (!editingRoom && formData.images.includes(img)) {
      console.log("✅ Eliminando URL de habitación nueva");
      setFormData({
        ...formData,
        images: formData.images.filter((i) => i !== img),
      });
      toast.success("URL eliminada");
      return;
    }

    // Si la habitación está en modo edición y la imagen ya existe en el servidor
    if (editingRoom && formData.images.includes(img)) {
      console.log("🌐 Eliminando imagen del servidor");
      try {
        const res = await deleteImage(editingRoom._id, img);
        const updatedRoom = res?.data;
        if (!updatedRoom) throw new Error("Error al eliminar imagen");

        updatedRoom.images = updatedRoom.images.map((i) =>
          i.startsWith("http") ? i : `${API_URL}${i}`,
        );

        setFormData({ ...formData, images: updatedRoom.images });
        setRooms(
          rooms.map((r) => (r._id === editingRoom._id ? updatedRoom : r)),
        );
        setEditingRoom(updatedRoom);
        toast.success("Imagen eliminada");
      } catch (err) {
        console.error(err);
        toast.error("Error al eliminar la imagen");
      }
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
              images: formData.images, // ✅ Incluir las URLs agregadas
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
              data,
            );
            savedRoom = uploadRes.data?.datos || uploadRes.data;
          }

          // Normalizar URLs
          savedRoom.images =
            savedRoom.images?.map((img) =>
              img.startsWith("http") ? img : `${API_URL}${img}`,
            ) || [];

          // Actualizar contexto
          if (editingRoom) {
            setRooms(
              rooms.map((r) => (r._id === savedRoom._id ? savedRoom : r)),
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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Habitaciones
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Administra las habitaciones del resort
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-[rgb(150,130,96)] hover:bg-[rgb(130,110,76)] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Agregar Habitación
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid de habitaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(rooms) && rooms.length > 0 ? (
            rooms.map((room) => {
              const currentIndex = currentImageIndexes[room._id] || 0;
              const images = room.images || [];

              const showPrev = (roomId) => {
                setCurrentImageIndexes((prev) => ({
                  ...prev,
                  [roomId]:
                    ((prev[roomId] || 0) - 1 + images.length) % images.length,
                }));
              };

              const showNext = (roomId) => {
                setCurrentImageIndexes((prev) => ({
                  ...prev,
                  [roomId]: ((prev[roomId] || 0) + 1) % images.length,
                }));
              };

              return (
                <div
                  key={room._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
                >
                  {/* Imagen con carrusel */}
                  <div className="relative h-48 bg-gray-100">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[currentIndex]}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => showPrev(room._id)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 shadow transition-all"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => showNext(room._id)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 shadow transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {images.map((_, i) => (
                                <span
                                  key={i}
                                  className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/50"}`}
                                />
                              ))}
                            </div>
                            <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                              {currentIndex + 1}/{images.length}
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {room.name}
                    </h3>

                    <div className="flex items-center gap-1 text-[rgb(150,130,96)] font-bold text-xl mb-3">
                      <DollarSign className="w-5 h-5" />
                      {room.price}
                      <span className="text-sm text-gray-500 font-normal ml-1">
                        / noche
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(room)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[rgb(150,130,96)] hover:bg-[rgb(130,110,76)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No hay habitaciones registradas
              </p>
              <button
                onClick={() => openModal()}
                className="mt-4 inline-flex items-center gap-2 text-[rgb(150,130,96)] hover:text-[rgb(130,110,76)] font-medium"
              >
                <Plus className="w-5 h-5" />
                Agregar primera habitación
              </button>
            </div>
          )}
        </div>
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

              {/* Agregar imagen por URL */}
              <div className="border-t pt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Agregar imagen por URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 border p-2 rounded"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[rgb(150,130,96)] text-white rounded hover:bg-[rgb(130,110,76)] transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Puedes usar imágenes de Unsplash, Pexels, etc.
                </p>
              </div>

              {/* O subir archivo local */}
              <div className="border-t pt-4">
                <label className="block text-gray-700 font-medium mb-2">
                  O subir desde tu computadora
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Previews de archivos locales */}
              {/* Previews de archivos locales */}
              {localImages.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Archivos pendientes de subir
                  </label>
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {localImages.map((img) => (
                      <div key={img.preview} className="relative">
                        <img
                          src={img.preview}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded border-2 border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.preview)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Imágenes ya guardadas (URLs o subidas) */}
              {formData.images?.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Imágenes actuales ({formData.images.length})
                  </label>
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {formData.images.map((img, idx) => {
                      console.log(`🖼️ Renderizando imagen ${idx}:`, img);
                      return (
                        <div key={img + idx} className="relative">
                          <img
                            src={img}
                            alt="preview"
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              console.error("❌ Error cargando imagen:", img);
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23ddd' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E❌%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
