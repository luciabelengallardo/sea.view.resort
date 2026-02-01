import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  destino: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  huespedes: { type: Number, required: true }
});

export default mongoose.model("Form", formSchema);