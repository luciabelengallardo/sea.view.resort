import User from "../models/user.model.js";
import { createToken } from "../helpers/jwt.js";
import transport from "../helpers/mailer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { email } from "zod";

export const passwordResetRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const resetToken = await createToken({
      id: user._id,
      purpose: "password_reset",
    });

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/password-change?token=${resetToken}`;

    const mailOptions = {
      from: `"Sea View Resort" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Instrucciones para recuperar tu contraseña",
      template: "forgotPassword",
      context: {
        name: user.username,
        link: resetLink,
        subject: "Recuperar contraseña",
      },
    };

    await transport.sendMail(mailOptions);

    res.status(200).json({
      message: "Email con instrucciones enviado",
      expiresIn: "1h",
    });
  } catch (error) {
    console.error("Error en la passwordResetRequest:", {
      message: error.message,
      stack: error.stack,
      email: req.body.email,
    });

    res.status(500).json({
      message: "Error al procesar la solicitud",
      error: error.message,
    });
  }
};

export const passwordChange = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    jwt.verify(token, process.env.SECRET_KEY_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token invalido o expirado",
          error: err.message,
        });
      }
      const user = await User.findOne({
        _id: decoded.id,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message: "Usuario no encontrado o token invalido",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      res.status(200).json({
        message: "Contraseña actualizada con exito",
      });
    });
  } catch (error) {
    console.error("Error en passwordChange", error);
    res.status(500).json({
      message: "Error al cambiar la contraseña",
      error: error.message,
    });
  }
};
