import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destino: { type: String, required: true },
    huespedes: { type: Number, required: true, min: 1 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    precioPorNoche: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Reserva", reservaSchema);
