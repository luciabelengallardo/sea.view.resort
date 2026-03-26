import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [25, "El nombre no puede superar los 25 caracteres"],
    },
    type: {
      type: String,
      // por defecto usamos el nombre como tipo para mantener compatibilidad
      default: function () {
        return this.name;
      },
    },
    price: {
      type: Number,
      required: true,
      min: [0, "El precio debe ser positivo"],
    },
    description: {
      type: String,
      required: true,
      maxlength: [440, "La descripción no puede superar los 440 caracteres"],
    },
    images: [{ type: String }],
    maxGuests: {
      type: Number,
      default: 4,
      min: [1, "Debe permitir al menos 1 huésped"],
      max: [20, "Máximo 20 huéspedes por habitación"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Room", roomSchema);
