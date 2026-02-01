import Room from "../models/room.model.js";
import fs from "fs";
import path from "path";

// Obtener todas las habitaciones
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener habitación por ID
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room)
      return res.status(404).json({ message: "Habitación no encontrada" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nueva habitación
export const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar habitación
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room)
      return res.status(404).json({ message: "Habitación no encontrada" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar habitación y sus imágenes
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room)
      return res.status(404).json({ message: "Habitación no encontrada" });

    if (room.images?.length) {
      room.images.forEach((imgPath) => {
        const filePath = path.resolve("uploads", path.basename(imgPath));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.json({ message: "Habitación eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subir imagen
export const uploadImage = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room)
      return res.status(404).json({ message: "Habitación no encontrada" });

    if (!req.file)
      return res.status(400).json({ message: "No se envió ninguna imagen" });

    const imagePath = `/uploads/${req.file.filename}`;
    room.images = [...(room.images || []), imagePath];
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar imagen por índice
export const deleteImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const room = await Room.findById(id);
    if (!room)
      return res.status(404).json({ message: "Habitación no encontrada" });

    const idx = parseInt(index);
    if (isNaN(idx) || idx < 0 || idx >= room.images.length) {
      return res.status(400).json({ message: "Índice inválido" });
    }

    const imageToDelete = room.images[idx];
    const filePath = path.resolve("uploads", path.basename(imageToDelete));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    room.images.splice(idx, 1);
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
