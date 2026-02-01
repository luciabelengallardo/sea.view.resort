import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [25, "El nombre no puede superar los 25 caracteres"],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", roomSchema);
