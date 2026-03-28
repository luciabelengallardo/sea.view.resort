import { createContext, useContext, useState, useEffect } from "react";
import { apiUrl } from "../services/http";
import axios from "axios";

const RoomsContext = createContext();

export function RoomsProvider({ children }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const resp = await axios.get(apiUrl("/api/rooms"));
        const data = resp.data;
        const backendRooms = Array.isArray(data)
          ? data
          : Array.isArray(data?.datos)
            ? data.datos
            : [];

        const normalized = backendRooms.map((room) => ({
          ...room,
          id: room._id || room.id,
          images: (room.images || []).map((img) =>
            String(img).startsWith("http") ? img : `${apiUrl("")}${img}`,
          ),
        }));


        setRooms(normalized);
      } catch (error) {
        console.error("No se pudo conectar al backend:", error);
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
