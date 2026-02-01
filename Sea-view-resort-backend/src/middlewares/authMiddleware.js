import jwt from "jsonwebtoken";

// Middleware para verificar si el usuario está autenticado
export const protect = (req, res, next) => {
  let token;

  // aquí lo que hago es verificar si el token viene en el header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // y guardo el payload en req.user (puede ser el id y rol)
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token no válido o expirado" });
    }
  }

  // si no viene token
  return res.status(401).json({ message: "No autorizado, token no encontrado" });
};

// Middleware para permitir solo administradores
export const isAdmin = (req, res, next) => {
  // verifico que el usuario esté autenticado y tenga rol de admin
  if (req.user && req.user.role === "admin") {
    return next();
  }
  // si no es admin
  return res.status(403).json({ message: "Acceso denegado: solo administradores" });
};
