import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../services/http";

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(apiUrl("/api/admin/users"), {
          withCredentials: true,
        });
        if (Array.isArray(data)) setUsers(data);
      } catch (error) {
        console.warn("No se pudo conectar al backend, se muestran usuarios vacíos.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
}


export const useUsers = () => useContext(UsersContext);
