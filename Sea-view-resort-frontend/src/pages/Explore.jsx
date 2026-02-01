import ExploreSection from "../components/explore/ExploreSection.jsx";
import ExploreHero from "../components/explore/ExploreHero.jsx";

import gym1 from "../assets/AreasComunes/Gym/pexels-rdne-8611937.jpg";
import gym2 from "../assets/AreasComunes/Gym/pexels-willpicturethis-1954524.jpg";
import gym3 from "../assets/AreasComunes/Gym/pexels-victorfreitas-703016.jpg";
import gym4 from "../assets/AreasComunes/Gym/pexels-eduardo-cano-photo-co-3550159-7811530.jpg";

import jard1 from "../assets/AreasComunes/Jardines/pexels-siddanth-sawant-178759136-33259642.jpg";
import jard2 from "../assets/AreasComunes/Jardines/pexels-siddanth-sawant-178759136-33259643.jpg";
import jard3 from "../assets/AreasComunes/Jardines/pexels-siddanth-sawant-178759136-33259655.jpg";
import jard4 from "../assets/AreasComunes/Jardines/pexels-siddanth-sawant-178759136-33259641.jpg";

import pool1 from "../assets/AreasComunes/Pileta-Playa/pexels-geek-wandering-420882909-29289153.jpg";
import pool2 from "../assets/AreasComunes/Pileta-Playa/pexels-thorsten-technoman-109353-338504.jpg";
import pool3 from "../assets/AreasComunes/Pileta-Playa/pexels-wewe-yang-2383099-4025955.jpg";
import pool4 from "../assets/AreasComunes/Pileta-Playa/pexels-gapeppy1-2373201.jpg";

import rest1 from "../assets/AreasComunes/Restaurantes/pexels-naimbic-2290753.jpg";
import rest2 from "../assets/AreasComunes/Restaurantes/recortada-mujer-que-toma-el-bocado-de-la-tabla-buffet.jpg";
import rest3 from "../assets/AreasComunes/Restaurantes/pexels-pixabay-262978.jpg";
import rest4 from "../assets/AreasComunes/Restaurantes/pexels-helenalopes-696218.jpg";

import spa1 from "../assets/AreasComunes/Spa/pexels-pixabay-269110.jpg";
import spa2 from "../assets/AreasComunes/Spa/pexels-pixabay-161737.jpg";
import spa3 from "../assets/AreasComunes/Spa/pexels-olly-3757952.jpg";
import spa4 from "../assets/AreasComunes/Spa/pexels-jonathanborba-3316923.jpg";


const sections = [
  {
    title: "Playa y Pileta",
    imageUrls: [pool1, pool2, pool3, pool4],
    description:
      "Disfrutá del sol y la brisa junto al mar. Espacios pensados para relajarte en cualquier momento del día.",
  },
  {
    title: "Jardines",
    imageUrls: [jard1, jard2, jard3, jard4],
    description:
      "Conectá con la naturaleza en senderos y áreas verdes que invitan a pasear y descansar.",
  },
  {
    title: "Restaurantes",
    imageUrls: [rest1, rest2, rest3, rest4],
    description:
      "Sabores únicos y propuestas gourmet para todos los gustos, con vistas inmejorables.",
  },
  {
    title: "Spa",
    imageUrls: [spa1, spa2, spa3, spa4],
    description:
      "Relajate con masajes y tratamientos de bienestar diseñados para renovar cuerpo y mente.",
  },
  {
    title: "Gym",
    imageUrls: [gym1, gym2, gym3, gym4],
    description:
      "Entrená con equipamiento de primer nivel en un ambiente cómodo y luminoso.",
  },
];

function SectionList() {
  return (
    <div className="space-y-6 md:space-y-8">
      {sections.map((item) => (
        <ExploreSection
          key={item.title}
          imageUrls={item.imageUrls}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
}

export default function Explore() {
  return (
    <div className="bg-white">
      <ExploreHero />
      <section className="py-16">
        <div className="container mx-auto">
          <h1 className="text-center text-3xl md:text-4xl font-serif text-gray-900 mb-12">Recorré nuestros espacios</h1>
          <SectionList />
        </div>
      </section>
    </div>
  );
}
