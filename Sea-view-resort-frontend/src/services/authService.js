import axios from "axios";
import { apiUrl } from "./http";
const API_PREFIX = "/api/auth";
const getToken = () => localStorage.getItem("token");

export const register = async (userData) => {
  const res = await axios.post(apiUrl(`${API_PREFIX}/register`), userData);
  if (res?.data?.token) {
    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  }
  return res.data;
};

export const login = async (data) => {
  try {
    const res = await axios.post(apiUrl(`${API_PREFIX}/login`), data);

    if (res?.data?.token) {
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }

    return {
      token: res.data.token,
      user: {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        profileImage: res.data.profileImage,
      },
    };
  } catch (error) {
    throw new Error("Error al intentar iniciar sesion");
  }
};

export const logoutLocal = () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
};

export const verifyToken = async () => {
  const res = await fetch(apiUrl(`${API_PREFIX}/verify-token`), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.ok;
};

export const profile = async () => {
  const res = await fetch(apiUrl(`${API_PREFIX}/profile`), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Token invalido");
  return await res.json();
};
