import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RoomsProvider } from "./context/RoomsContext.jsx";
import { Toaster } from "react-hot-toast";

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
  </StrictMode>
);
