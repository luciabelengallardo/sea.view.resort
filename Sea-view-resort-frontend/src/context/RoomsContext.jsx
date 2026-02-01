import { createContext, useContext, useState, useEffect } from "react";
import { apiUrl } from "../services/http";
import axios from "axios";

const RoomsContext = createContext();

export function RoomsProvider({ children }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get(apiUrl("/api/rooms"));
        const backendRooms = data.datos || [];

        const normalized = backendRooms.map((room) => ({
          ...room,
          images: (room.images || []).map((img) =>
            img.startsWith("http") ? img : `${apiUrl("")}${img}`,
          ),
        }));

        setRooms(normalized);
      } catch (error) {
        console.error("No se pudo conectar al backend:", error);
        // ✅ Deja rooms como [] SIN imágenes locales
        setRooms([]);
      }
    };

    fetchRooms();
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomsContext.Provider>
  );
}

export const useRooms = () => useContext(RoomsContext);
