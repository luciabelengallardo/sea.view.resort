import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createToken } from "../helpers/jwt.js";
import transport from "../helpers/mailer.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userMatch = await User.findOne({ email });

    if (userMatch)
      return res.status(400).json({ error: ["El email ya esta en uso"] });

    const passwordHash = await bcrypt.hash(password, 12);

    const role = email === "seaviewresort.noreply@gmail.com" ? "admin" : "user";

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      username: email,
      email,
      password: passwordHash,
      verificationToken,
      role,
    });

    const savedUser = await newUser.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: savedUser.email,
      subject: "Verifica tu email - Sea View Resort",
      template: "verifyEmail",
      context: {
        email: savedUser.email,
        verificationLink,
      },
    });

    const token = await createToken({
      id: savedUser._id,

      email: savedUser.email,
      role: savedUser.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(201).json({
      id: savedUser._id,

      email: savedUser.email,
      isVerified: savedUser.isVerified,
      role: savedUser.role,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userMatch = await User.findOne({ email });
    if (!userMatch)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const passwordMatch = await bcrypt.compare(password, userMatch.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Credenciales invalidas" });

    if (
      userMatch.email === "seaviewresort.noreply@gmail.com" &&
      userMatch.role !== "admin"
    ) {
      userMatch.role = "admin";
      await userMatch.save();
    }

    const token = await createToken({
      id: userMatch._id,

      email: userMatch.email,
      role: userMatch.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      id: userMatch._id,

      email: userMatch.email,
      isVerified: userMatch.isVerified,
      role: userMatch.role,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });

    res.status(200).json({ message: "Sesión cerrada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const userMatch = await User.findById(req.user.id);

    if (!userMatch)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json({
      id: userMatch.id,

      email: userMatch.email,
      profileImage: userMatch.profileImage,
      createdAt: userMatch.createdAt,
      updatedAt: userMatch.updatedAt,
      role: userMatch.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const authHeaders = req.headers.authorization;

    let token;

    if (authHeaders && authHeaders.startsWith("Bearer ")) {
      token = authHeaders.split(" ")[1];
    } else {
      return res.status(401).json({ message: "Token no recibido" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    const userMatch = await User.findById(decoded.id);

    if (!userMatch)
      return res.status(401).json({ message: "Usuario no encontrado" });

    return res.json({
      id: userMatch._id,

      email: userMatch.email,
      isVerified: userMatch.isVerified,
      role: userMatch.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token invalido" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      const userVerified = await User.findOne({
        isVerified: true,
        verificationToken: undefined,
      });
      if (userVerified) {
        return res.status(200).json({
          success: true,
          message: "Email ya verificado",
          user: {
            email: userVerified.email,
            isVerified: userVerified.isVerified,
          },
        });
      }
      return res.status(400).json({ message: "Token invalido o expirado" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return res.status(200).json({ success: true, message: "Email verificado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
