import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verificando...");
  const token = searchParams.get("token");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!token) {
        setStatus("No se proporciono ningun token");
        setError(true);
        return;
      }

      try {
        const res = await axios.get(
          `/api/v1/verify-email?token=${token}`
        );

        if (isMounted && res.data.success) {
          setStatus(
            "¡Listo! Tu email está verificado. Inicia sesión para continuar."
          );
          setVerified(true);
        }
      } catch (error) {
        if (isMounted) {
          setStatus("El token es invalido o expiro");
          setError(true);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Verificación de Email</h2>

          <p>{status}</p>

          {verified && (
            <Button onClick={() => navigate("/login")} className="mt-4">
              Iniciar Sesión
            </Button>
          )}

          {error && (
            <Button onClick={() => navigate("/")} className="mt-4">
              Volver al inicio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
