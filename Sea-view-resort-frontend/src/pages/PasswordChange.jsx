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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const res = await fetch(apiUrl(`/api/v1/password-change/${token}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message || "Contraseña actualizada");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } else {
      setError(data.message || "Error al actualizar contraseña");
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

        <Button className="w-full">Cambiar contraseña</Button>

        {message && <p className="text-[rgb(150,130,96)]  mt-3">{message}</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </form>
    </div>
  );
}

export default PasswordChange;
