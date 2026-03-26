import { Waves, Coffee, Dumbbell, Wifi } from "lucide-react";

const stats = [
  { label: "Años de excelencia", value: "12+" },
  { label: "Habitaciones y suites", value: "80+" },
  { label: "Premios", value: "15" },
  { label: "Huéspedes satisfechos", value: "25k+" },
];

const values = [
  {
    icon: Waves,
    title: "Vista al mar",
    text: "Habitaciones con vista al océano para disfrutar del paisaje.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi rápido",
    text: "Internet de alta velocidad en todo el resort.",
  },
  {
    icon: Coffee,
    title: "Restaurante",
    text: "Comidas preparadas con ingredientes frescos y de calidad.",
  },
  {
    icon: Dumbbell,
    title: "Gym y spa",
    text: "Equipamiento completo para entrenar y relajarse.",
  },
];

export default function AboutContent() {
  return (
    <section className="bg-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-serif text-resort-olive mb-4">
              Nuestra historia
            </h2>
            <p className="text-resort-slate leading-relaxed">
              Sea View Resort lleva varios años recibiendo huéspedes que buscan
              relajarse frente al mar. El lugar combina comodidad moderna con la
              tranquilidad de estar cerca de la playa. Todo pensado para que
              disfrutes de unas buenas vacaciones.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-4 rounded-lg bg-resort-cream"
              >
                <div className="text-2xl font-semibold text-resort-olive">
                  {s.value}
                </div>
                <div className="text-sm text-resort-slate">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-gray-200">
              <v.icon className="w-6 h-6 text-resort-olive mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-resort-slate">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
