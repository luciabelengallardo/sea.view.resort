import { useState } from "react";
import { Button } from "../components/ui/Button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../services/http";

function PasswordChange() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = params.get("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
          <p className="text-red-500">Token inválido o expirado</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!password) {
      setError("Por favor ingresa una contraseña");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      console.log("Enviando password change con token:", token);
      const res = await fetch(apiUrl(`/api/auth/password-change/${token}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        setMessage(data.message || "Contraseña actualizada correctamente");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        setError(data.message || "Error al actualizar contraseña");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar la solicitud: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Nueva contraseña</h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="w-full">
          Cambiar contraseña
        </Button>

        {message && <p className="text-[rgb(150,130,96)]  mt-3">{message}</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  );
}

export default PasswordChange;
