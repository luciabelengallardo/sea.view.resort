import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import beachImg from "../assets/AreasComunes/Pileta-Playa/pexels-gapeppy1-2373201.jpg";
import { apiUrl } from "../services/http";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const res = await fetch(apiUrl(`/api/v1/password-reset-request`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message || "Email enviado");
    } else {
      setError(data.message || "Error");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-5 bg-gray-100">
      {/* Imagen lateral (igual que login/register) */}
      <div
        className="hidden md:block md:col-span-3 bg-cover bg-center"
        style={{ backgroundImage: `url(${beachImg})` }}
      >
        <div className="h-full w-full bg-black/20 flex items-end p-8 text-white">
          <div>
            <h3 className="text-2xl font-semibold">Recuperá el acceso a tu cuenta</h3>
            <ul className="mt-3 space-y-1 text-sm text-white/90">
              <li>• Te enviaremos instrucciones por email</li>
              <li>• Podrás crear una nueva contraseña</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-4 md:p-8 md:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white pt-16 md:pt-20 pb-8 md:pb-10 px-8 md:px-10 shadow rounded-2xl w-full max-w-lg"
        >
          {/* Avatar superior */}
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
                <path d="M3 11a8 8 0 1 1 16 0v2" />
                <rect x="7" y="13" width="10" height="8" rx="2" />
              </svg>
              <span className="sr-only">Recuperar contraseña</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Recuperar contraseña</h2>

          <div className="relative mb-6">
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Button className="w-full mb-4">Enviar instrucciones</Button>

          {message && <p className="text-[rgb(150,130,96)] text-center">{message}</p>}
          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

          <p className="mt-4 text-center text-sm">
            ¿Recordaste tu contraseña? {""}
            <Link to="/login" className="text-[rgb(150,130,96)] hover:underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
