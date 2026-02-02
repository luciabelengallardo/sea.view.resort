import { useEffect, useState } from "react";
import * as authService from "../services/authService";
import { apiUrl, fetchApi } from "../services/http";

export default function Reservations() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ roomId: "", destino: "playa", huespedes: 1, checkIn: "", checkOut: "" });
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/api/reservas");
      if (!res.ok) throw new Error("Error cargando reservas");
      const data = await res.json();
      setReservas(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetchApi("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: form.roomId,
          destino: form.destino,
          huespedes: Number(form.huespedes),
          checkIn: form.checkIn,
          checkOut: form.checkOut,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.message || "Error al crear reserva");
      }
      await load();
      setForm({ roomId: "", destino: "playa", huespedes: 1, checkIn: "", checkOut: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetchApi(`/api/reservas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Crear reserva</h2>
        <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
          <label className="block">
            RoomId
            <input name="roomId" value={form.roomId} onChange={handleChange} className="mt-1 w-full" />
          </label>
          <label className="block">
            Check In
            <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} className="mt-1 w-full" />
          </label>
          <label className="block">
            Check Out
            <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} className="mt-1 w-full" />
          </label>
          <label className="block">
            Huéspedes
            <input type="number" min={1} name="huespedes" value={form.huespedes} onChange={handleChange} className="mt-1 w-full" />
          </label>
          <label className="block">
            Destino
            <input name="destino" value={form.destino} onChange={handleChange} className="mt-1 w-full" />
          </label>
          <div>
            <button className="px-3 py-2 bg-blue-600 text-white rounded">Reservar</button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </section>

      <section>
        <h2 className="font-semibold">Listado</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul className="space-y-2">
            {reservas.map((r) => (
              <li key={r._id} className="p-3 border rounded flex justify-between items-start">
                <div>
                  <div className="font-semibold">{r.roomId?.name || r.roomId}</div>
                  <div className="text-sm text-gray-600">{new Date(r.checkIn).toLocaleDateString()} → {new Date(r.checkOut).toLocaleDateString()}</div>
                  <div className="text-sm">Huéspedes: {r.huespedes} · Destino: {r.destino}</div>
                </div>
                <div>
                  <button onClick={() => handleDelete(r._id)} className="px-2 py-1 bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </li>
            ))}
            {reservas.length === 0 && <li>No hay reservas</li>}
          </ul>
        )}
      </section>
    </main>
  );
}
