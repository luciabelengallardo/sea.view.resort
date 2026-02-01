import { Waves, Wifi, Coffee, Dumbbell, Gamepad2, Lightbulb, Shirt, Car } from 'lucide-react';

const facilities = [
  { icon: Waves, label: 'Piscina' },
  { icon: Wifi, label: 'Wi‑Fi de cortesía' },
  { icon: Coffee, label: 'Desayuno incluido' },
  { icon: Dumbbell, label: 'Gimnasio' },
  { icon: Gamepad2, label: 'Sala de juegos' },
  { icon: Lightbulb, label: 'Energía 24/7' },
  { icon: Shirt, label: 'Lavandería' },
  { icon: Car, label: 'Estacionamiento' },
];

export default function Facilities() {
  return (
    <section className="section-standard bg-white flex items-start pt-16 md:pt-20 pb-24 md:pb-28">
      <div className="container">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl font-serif text-gray-900 mb-3">Nuestras instalaciones</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Comodidades modernas de categoría para una estadía excepcional.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-10 md:p-12 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <facility.icon className="w-10 h-10 text-resort-olive" />
              <h3 className="mt-6 text-lg font-medium text-resort-olive">{facility.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


