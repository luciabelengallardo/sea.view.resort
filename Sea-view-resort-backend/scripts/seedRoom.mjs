import dotenv from "dotenv";
import mongoose from "mongoose";
import Room from "../src/models/room.model.js";

dotenv.config({ path: "./.env", silent: true });

// If script is executed from repo root, try backend .env explicitly
if (!process.env.MONGO_URI) {
  dotenv.config({ path: "./Sea-view-resort-backend/.env", silent: true });
}

const MONGO =
  process.env.MONGO_URI || "mongodb://localhost:27017/sea-view-resort";

async function run() {
  await mongoose.connect(MONGO, { dbName: "sea-view-resort" });
  console.log("Connected to Mongo");

  const roomData = {
    name: "Test Standard 101",
    type: "standard",
    price: 120,
    description: "Habitación de prueba insertada por script",
    images: [],
  };

  const existing = await Room.findOne({ name: roomData.name });
  if (existing) {
    console.log("Room already exists:", existing._id.toString());
    process.exit(0);
  }

  const room = new Room(roomData);
  await room.save();
  console.log("Created room:", room._id.toString());
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
