import React from "react";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import beachImg from "../assets/AreasComunes/Pileta-Playa/pexels-gapeppy1-2373201.jpg";

function Register() {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden", {
        iconTheme: {
          primary: "#968260",
          secondary: "#fff",
        },
      });
      return;
    }

    try {
      // Enviar solo email y password al backend
      await register({ email: data.email, password: data.password });
      toast.success("Gracias por registrarte. Revisa tu email.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);

      let errorMsg = "Error al registrarse";

      if (err.response?.data?.error) {
        // El backend devuelve error como array
        const errors = err.response.data.error;
        if (Array.isArray(errors)) {
          errors.forEach((msg) =>
            toast.error(msg, {
              iconTheme: {
                primary: "#968260",
                secondary: "#fff",
              },
            }),
          );
          return;
        } else {
          errorMsg = errors;
        }
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      toast.error(errorMsg, {
        iconTheme: {
          primary: "#968260",
          secondary: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-5 bg-gray-100">
      <div className="flex items-center justify-center p-4 md:p-8 md:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white pt-16 md:pt-20 pb-8 md:pb-10 px-8 md:px-10 shadow rounded-2xl w-full max-w-lg"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow">
              <svg
                className="h-8 w-8 text-resort-olive"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span className="sr-only">Registro</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Crear cuenta
          </h2>

          <div className="relative mb-6">
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded px-3 py-3 bg-white focus:outline-none focus:border-resort-olive"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-resort-olive"
            >
              Email
            </label>
          </div>

          <div className="relative mb-6">
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded px-3 py-3 bg-white focus:outline-none focus:border-resort-olive"
              required
              minLength="6"
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-resort-olive"
            >
              Contraseña
            </label>
          </div>

          <div className="relative mb-6">
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded px-3 py-3 bg-white focus:outline-none focus:border-resort-olive"
              required
              minLength="6"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-resort-olive"
            >
              Confirmar Contraseña
            </label>
          </div>

          <Button type="submit" className="w-full mb-4">
            Registrarse
          </Button>
          <p className="text-center text-sm">
            ¿Ya tienes una cuenta? {""}
            <Link
              to="/login"
              className="text-[rgb(150,130,96)] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      <div
        className="hidden md:block md:col-span-3 bg-cover bg-center"
        style={{ backgroundImage: `url(${beachImg})` }}
      >
        <div className="h-full w-full bg-black/20 flex items-end p-8 text-white">
          <div>
            <h3 className="text-2xl font-semibold">Crea tu cuenta</h3>
            <ul className="mt-3 space-y-1 text-sm text-white/90">
              <li>• Ofertas exclusivas</li>
              <li>• Administra tus reservas</li>
              <li>• Experiencia personalizada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
