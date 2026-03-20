import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RoomsProvider } from "./context/RoomsContext.jsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// load token from localStorage on app start for axios default headers
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RoomsProvider>
          <App />
        </RoomsProvider>
      </AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  </StrictMode>,
);
