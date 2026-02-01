import { createContext, useContext, useState, useEffect } from "react";

import * as authService from "../services/authService";
import { apiUrl } from "../services/http";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const login = async (credentials) => {
    const { token, user } = await authService.login(credentials);
    console.log("Login exitoso - Token", token);
    localStorage.setItem("token", token);
    // Actualizamos el usuario con la respuesta básica y luego cargamos el perfil completo
    setUser(user);
    const profileData = await getProfile();
    return profileData;
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileImage(null);
    await fetch(apiUrl("/api/v1/logout"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  };

  const getProfile = async () => {
    const token = getToken();
    if (!token) {
      console.log("No hay token");
      return;
    }
    const data = await authService.profile();
    setUser(data);

    if (data.profileImage) {
      const base = import.meta.env.VITE_PUBLIC_API_BASE || '';
      setProfileImage(`${base}${data.profileImage}`);
    }
    return data;
  };

  useEffect(() => {
    const token = getToken();
    console.log("Token al iniciar");
    if (!token) {
      setLoading(false);
      return;
    }
    const init = async () => {
      try {
        const valid = await authService.verifyToken();
        console.log("token valido: ", valid);
        if (valid) {
          await getProfile();
        } else {
          logout();
        }
      } catch (error) {
        console.log("error al verificar token:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,

        getProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
