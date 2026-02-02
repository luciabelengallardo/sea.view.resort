import express, { urlencoded } from "express";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import roomsRouter from "./src/routes/rooms.js";
import reservasRouter from "./src/routes/reservas.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config({ quiet: true });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-type", "Authorization", "Set-Cookie"],
  exposedHeaders: ["Set-Cookie"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// Request timing logger + simple timeout to detect blocking handlers
app.use((req, res, next) => {
  req._startAt = Date.now();
  const timeoutMs = 15000; // 15s
  const timer = setTimeout(() => {
    console.error(
      `Request timeout: ${req.method} ${req.originalUrl} - ${Date.now() - req._startAt}ms`,
    );
    if (!res.headersSent) {
      res.status(504).json({ message: "Request timeout (debug)" });
    }
  }, timeoutMs);

  res.on("finish", () => {
    clearTimeout(timer);
    const duration = Date.now() - req._startAt;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
});

// --- Rutas ---
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// app.use("/api/rooms", roomsRouter);
// app.use("/api", reservasRouter);
// app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Health check endpoint (activo solo en desarrollo o si se habilita explícitamente)
if (
  process.env.ENABLE_HEALTH === "true" ||
  process.env.NODE_ENV !== "production"
) {
  app.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });
}

const routeFiles = fs.readdirSync("./src/routes");
const mounted = new Set();
routeFiles.forEach((file) => {
  const base = file.replace(/\.routes?\.js$/, "").replace(/\.js$/, "");
  if (mounted.has(base)) return; // skip duplicate route files (keep first)
  mounted.add(base);
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use(`/api/${base}`, route.default);
    })
    .catch((err) => {
      console.error(`Error al cargar la ruta ${file}:`, err);
    });
});

export default app;
