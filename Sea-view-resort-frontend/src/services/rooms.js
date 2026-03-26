import honeymoon1 from "../assets/Habitaciones/HoneymoonSuite/pexels-ahmetcotur-28356599.webp";
import honeymoon2 from "../assets/Habitaciones/HoneymoonSuite/pexels-ahmetcotur-31817152.webp";
import honeymoon3 from "../assets/Habitaciones/HoneymoonSuite/pexels-ahmetcotur-31817153.webp";
import honeymoon4 from "../assets/Habitaciones/HoneymoonSuite/pexels-ahmetcotur-31817165.webp";
import honeymoon5 from "../assets/Habitaciones/HoneymoonSuite/pexels-ahmetcotur-31817169 (1).webp";

export function getRoomById(id) {
  if (id === "demo-room") {
    return {
      id: "demo-room",
      title: "Honeymoon Suite",
      pricePerNight: 250000,
      images: [honeymoon1, honeymoon2, honeymoon3, honeymoon4, honeymoon5],
      features: [
        "Cama king con ropa de cama premium",
        "Balcón privado con vistas espectaculares",
        "Entretenimiento de última generación",
        "Baño estilo spa con ducha tipo lluvia",
        "Acabados en mármol con amenities de lujo",
        "Climatización independiente",
        "Cortinas blackout para un descanso perfecto",
        "Minibar con selección premium",
      ],
    };
  }
  // Fallback simple mientras no hay otras habitaciones
  return getRoomById("demo-room");
}
