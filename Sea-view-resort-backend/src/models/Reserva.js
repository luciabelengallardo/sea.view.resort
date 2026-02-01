import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  destino: { type: String, required: true },
  huespedes: { type: Number, required: true, min: 1 },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true }
});

export default mongoose.model("Reserva", reservaSchema);