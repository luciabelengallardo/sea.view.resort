import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const respuestasFijas = {
  "check in": "El check-in es a partir de las 14:00 hs.",
  "check-in": "El check-in es a partir de las 14:00 hs.",
  "check out": "El check-out es hasta las 11:00 hs.",
  "check-out": "El check-out es hasta las 11:00 hs.",
  "transfer": "Sí, ofrecemos transfers desde y hacia el aeropuerto. Se debe reservar con anticipación.",
  "aeropuerto": "Sí, contamos con transfers desde y hacia el aeropuerto, con reserva previa.",
  "pet": "Somos pet friendly 🐾, pedimos a los dueños ser responsables con sus mascotas.",
  "mascota": "Somos pet friendly 🐾, pedimos a los dueños ser responsables con sus mascotas.",
  "pet friendly": "Sí, aceptamos mascotas; por favor, responsabilidad de los dueños.",
  "celiaco": "Contamos con opciones sin TACC para personas celíacas.",
  "celíaco": "Contamos con opciones sin TACC para personas celíacas.",
  "sin tacc": "Contamos con opciones sin TACC para personas celíacas.",
  "wifi": "Todo el hotel cuenta con WiFi gratuito de alta velocidad.",
  "piscina": "Tenemos piscina al aire libre y climatizada (según temporada).",
  "spa": "Contamos con spa con masajes y sauna (con costo adicional).",
  "estacionamiento": "Tenemos estacionamiento cubierto sujeto a disponibilidad.",
  "estacionar": "Tenemos estacionamiento cubierto sujeto a disponibilidad.",
  "desayuno": "El desayuno buffet está incluido en la tarifa.",
  "horario restaurante": "Nuestro restaurante abre de 12:30 a 15:30 y de 20:00 a 23:30.",
  "habitaciones": "Ofrecemos habitaciones estándar, superior y suite, con vista al mar según disponibilidad.",
  "precio": "Nuestros precios varían según la temporada y tipo de habitación.",
  "alquiler de autos": "Sí, hay servicio de alquiler de autos cerca del hotel, con convenios especiales para nuestros huéspedes.",
  "alquiler autos": "Sí, hay servicio de alquiler de autos cerca del hotel, con convenios especiales para nuestros huéspedes.",
  "glamping": "El servicio de glamping en la playa incluye seguridad 24 horas para tu tranquilidad.",
  "tienda de campaña": "El área de tienda de campaña cuenta con seguridad 24 horas durante toda la temporada.",
  "seguridad": "Contamos con seguridad 24 horas en todas las instalaciones, incluyendo el glamping y tienda de campaña.",
  "hola": "¡Hola! ¿En qué puedo ayudarte?",
  "buenas": "¡Hola! ¿En qué puedo ayudarte?",
  "default": "Perdón, no tengo esa información ahora mismo. ¿Querés consultar recepción por WhatsApp?"
};

function buscarRespuestaFija(mensaje) {
  const m = mensaje.toLowerCase();
  const claves = Object.keys(respuestasFijas).sort((a, b) => b.length - a.length);
  for (const clave of claves) {
    if (m.includes(clave)) return respuestasFijas[clave];
  }
  return respuestasFijas["default"];
}

app.post("/chat", (req, res) => {
  const { message = "" } = req.body;
  const reply = buscarRespuestaFija(message);
  return res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend en http://localhost:${PORT}`));
