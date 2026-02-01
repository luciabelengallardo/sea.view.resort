import { ChevronDown } from 'lucide-react';
import Hero from '../hero/Hero';
import { Button } from '../ui/Button';

export default function RoomsHero() {
  const handleScrollDown = () => {
    const target = document.getElementById('rooms-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };
  return (
    <Hero
      backgroundVideo="https://res.cloudinary.com/dokpk3c2l/video/upload/v1755707266/20250820_125556_0002_usdnsf.mp4"
      overlay="bg-black/40"
      title="Habitaciones y Suites"
      subtitle="Habitaciones elegantes con diseño cuidado y todo lo necesario para una estadía perfecta."
    >
      <div className="mt-8 flex justify-center">
        <Button
          aria-label="Desplazarse hacia abajo"
          onClick={handleScrollDown}
          variant="outlineWhite"
          className="w-16 h-28 p-0 border-1 hover:bg-transparent focus:ring-white/60"
          radius="full"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </Button>
      </div>
    </Hero>
  );
}


