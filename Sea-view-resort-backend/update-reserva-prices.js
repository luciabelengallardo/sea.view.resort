import dotenv from "dotenv";
import mongoose from "mongoose";
import Reserva from "./src/models/Reserva.js";
import Room from "./src/models/room.model.js";

dotenv.config();

async function updateReservaPrices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const reservas = await Reserva.find();
    console.log(`📋 Found ${reservas.length} reservations to check`);

    let updated = 0;
    let priceDefault = 150; // Precio por defecto si no se encuentra la habitación

    for (const reserva of reservas) {
      // Si ya tiene precio y no es 0, saltar
      if (reserva.precioPorNoche > 0 && reserva.total > 0) {
        continue;
      }

      let precioPorNoche = priceDefault;
      let nights = Math.ceil(
        (new Date(reserva.checkOut) - new Date(reserva.checkIn)) /
          (1000 * 60 * 60 * 24),
      );

      // Intentar obtener el precio de la habitación
      if (reserva.roomId) {
        try {
          const room = await Room.findById(reserva.roomId);
          if (room && room.price) {
            precioPorNoche = room.price;
          }
        } catch (e) {
          console.log(`⚠️  Could not find room for reservation ${reserva._id}`);
        }
      }

      const total = precioPorNoche * nights;

      await Reserva.findByIdAndUpdate(reserva._id, {
        precioPorNoche,
        total,
      });

      updated++;
      console.log(
        `✅ Updated reservation ${reserva._id}: $${precioPorNoche}/night × ${nights} nights = $${total}`,
      );
    }

    console.log(`\n✨ Successfully updated ${updated} reservations`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

updateReservaPrices();
