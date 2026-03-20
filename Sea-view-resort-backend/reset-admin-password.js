import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import bcrypt from "bcryptjs";

async function resetAdminPassword() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Conectado a MongoDB\n");

    const adminEmail = "seaviewresort.noreply@gmail.com";
    const newPassword = "Admin123456"; // Cambiar después

    // Find admin user
    const admin = await User.findOne({ email: adminEmail, role: "admin" });
    if (!admin) {
      console.log("❌ Usuario admin no encontrado");
      process.exit(1);
    }

    // Reset password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    await admin.save();

    console.log("✓ Contraseña del admin reseteada");
    console.log(`\nCredenciales admin:\n`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Contraseña temporal: ${newPassword}`);
    console.log(
      `\n⚠️  IMPORTANTE: Cambia la contraseña después de loguearte\n`,
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

resetAdminPassword();
