import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import beachImg from "../assets/AreasComunes/Pileta-Playa/pexels-gapeppy1-2373201.jpg";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const loginResult = await login(form);
      if (loginResult && loginResult.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const messages = err.response?.data?.err;
      if (Array.isArray(messages)) {
        messages.forEach((msg) =>
          toast.error(msg, {
            iconTheme: {
              primary: "#968260",
              secondary: "#fff",
            },
          })
        );
      } else {
        toast.error(messages || "Error al iniciar sesion", {
          iconTheme: {
            primary: "#968260",
            secondary: "#fff",
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-5 bg-gray-100">
      <div
        className="hidden md:block md:col-span-3 bg-cover bg-center"
        style={{ backgroundImage: `url(${beachImg})` }}
      >
        <div className="h-full w-full bg-black/20 flex items-end p-8 text-white">
          <div>
            <h3 className="text-2xl font-semibold">Bienvenido a Sea View Resort</h3>
            <ul className="mt-3 space-y-1 text-sm text-white/90">
              <li>• Acceso seguro</li>
              <li>• Administra tus reservas</li>
              <li>• Beneficios exclusivos</li>
            </ul>
          </div>
        </div>
      </div>
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
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              <span className="sr-only">Inicio de sesión</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Iniciar sesión</h2>

          {error && <div className="text-yellow-500 text-sm mb-2">{error}</div>}

          <div className="relative mb-6">
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
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
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border rounded px-3 py-3 bg-white focus:outline-none focus:border-resort-olive"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-resort-olive"
            >
              Contraseña
            </label>
          </div>

          <Button type="submit" className="w-full mb-4">Entrar</Button>

          <div className="text-center text-sm space-y-2">
            <p>
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-[rgb(150,130,96)] hover:underline"
              >
                Regístrate
              </Link>
            </p>
            <p>
              <Link
                to="/forgot-password"
                className="text-[rgb(150,130,96)] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
