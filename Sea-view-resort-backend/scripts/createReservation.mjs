import dotenv from "dotenv";
import mongoose from "mongoose";
import Reserva from "../src/models/Reserva.js";

dotenv.config({ path: "./Sea-view-resort-backend/.env", silent: true });

const MONGO =
  process.env.MONGO_URI || "mongodb://localhost:27017/sea-view-resort";

async function run() {
  await mongoose.connect(MONGO);
  console.log("Connected to Mongo");

  const reservation = new Reserva({
    roomId: "69838519567ddae9a4646099",
    checkIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    destino: "playa",
    huespedes: 2,
    userId: "6983852792e491f15b2f5b49",
  });

  await reservation.save();
  console.log("Reservation created:", reservation._id.toString());
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
