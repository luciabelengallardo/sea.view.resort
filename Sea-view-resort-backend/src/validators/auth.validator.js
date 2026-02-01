import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email({ message: "Email invalido" })
    .regex(
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      { message: "Formato de email no permitido" }
    ),

  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, { message: "La contraseña debe contener al menos 6 caracteres" })
    .max(15, { message: "La contraseña debe contener menos de 16 caracteres" })
    .regex(/^[A-Za-z0-9]+$/, { message: "Contraseña invalida" }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email({ message: "Email invalido" }),

  password: z.string({ required_error: "La contraseña es requerida" }),
});
