import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Conectado a MongoDB\n");

    // Check if admin exists
    const existingAdmin = await User.findOne({
      email: "seaviewresort.noreply@gmail.com",
      role: "admin",
    });
    if (existingAdmin) {
      console.log("✓ Usuario admin ya existe:", existingAdmin.email);
      console.log("Contraseña: (resetear si es necesario)\n");
      process.exit(0);
    }

    // Create admin
    const adminPassword = "SeaviewAdmin123!"; // Default password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = new User({
      username: "admin",
      email: "seaviewresort.noreply@gmail.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Seaview",
      role: "admin",
      isVerified: true,
    });

    await adminUser.save();
    console.log("✓ Usuario admin creado exitosamente");
    console.log("Email:", adminUser.email);
    console.log("Username: admin");
    console.log("Contraseña temporal: SeaviewAdmin123!");
    console.log(
      "\n⚠️  IMPORTANTE: Cambia la contraseña después de primer login\n",
    );

    // List all users
    const allUsers = await User.find({}, "email username role");
    console.log("📋 Usuarios en BD:");
    allUsers.forEach((u) => {
      console.log(`  - ${u.email} (${u.username}) [${u.role}]`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAdmin();
