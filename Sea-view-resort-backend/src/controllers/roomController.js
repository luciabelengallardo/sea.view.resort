import Room from "../models/room.model.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener habitaciones" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const newRoom = new Room({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      images: [],
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json({ message: "Error al crear habitación" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar habitación" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Habitación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar habitación" });
  }
};

export const addImages = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    if (room.images.length + req.files.length > 10) {
      return res.status(400).json({
        message: `No se pueden subir ${req.files.length} imagen(es). El máximo permitido por habitación es 10. Por favor borre una imagen para continuar agregando.`,
      });
    }

    const imageUrls = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/rooms/${
        file.filename
      }`;
    });

    room.images.push(...imageUrls);
    await room.save();

    res.json({
      room,
      message: "Imágenes agregadas correctamente",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al subir imágenes", error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    const { imageUrl } = req.body;
    room.images = room.images.filter((img) => img !== imageUrl);

    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar imagen" });
  }
};
