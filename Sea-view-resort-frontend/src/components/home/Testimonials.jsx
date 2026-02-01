import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    date: '3 Mar 2023',
    name: 'Valentina Gómez',
    text:
      'La atención fue impecable. Cada detalle estuvo a la altura y el equipo siempre se anticipó a nuestras necesidades.',
    avatar: 'https://i.pravatar.cc/80?u=valentina',
  },
  {
    date: '12 Mar 2023',
    name: 'Lucas Fernández',
    text:
      'Instalaciones elegantes y una vista inolvidable. Una experiencia que supera expectativas.',
    avatar: 'https://i.pravatar.cc/80?u=lucas',
  },
  {
    date: '25 Mar 2023',
    name: 'Regina Delia',
    text:
      'Servicio cálido y profesional. Sin duda, un lugar al que volveremos.',
    avatar: 'https://i.pravatar.cc/80?u=regina',
  },
  {
    date: '8 Abr 2023',
    name: 'Germán Alva',
    text:
      'Confort absoluto y gastronomía de primer nivel. Recomendado para una escapada perfecta.',
    avatar: 'https://i.pravatar.cc/80?u=german',
  },
  {
    date: '19 Abr 2023',
    name: 'María López',
    text:
      'Ambiente sereno y staff muy atento. Una estadía memorable.',
    avatar: 'https://i.pravatar.cc/80?u=maria',
  },
  {
    date: '28 Abr 2023',
    name: 'Andrés Pérez',
    text:
      'La suite con vista al mar es sencillamente espectacular. Volvería sin dudarlo.',
    avatar: 'https://i.pravatar.cc/80?u=andres',
  },
  {
    date: '7 May 2023',
    name: 'Sofía Martínez',
    text:
      'El spa y las áreas comunes están diseñados con un gusto exquisito. Un lujo.',
    avatar: 'https://i.pravatar.cc/80?u=sofia',
  },
  {
    date: '21 May 2023',
    name: 'Diego Ramírez',
    text:
      'Todo funcionó a la perfección. Atención al detalle y excelente servicio.',
    avatar: 'https://i.pravatar.cc/80?u=diego',
  },
];

function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setItemsPerView(4);
      } else {
        setItemsPerView(1);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return itemsPerView;
}

export default function Testimonials() {
  const itemsPerView = useItemsPerView();
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < testimonials.length; i += itemsPerView) {
      chunks.push(testimonials.slice(i, i + itemsPerView));
    }
    return chunks;
  }, [itemsPerView]);

  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = pages.length;
  const [isPaused, setIsPaused] = useState(false);

  const prev = () => setCurrentPage((p) => (p - 1 + pageCount) % pageCount);
  const next = () => setCurrentPage((p) => (p + 1) % pageCount);

  // Autoplay del carrusel
  useEffect(() => {
    if (isPaused || pageCount <= 1) return;
    const id = setInterval(() => {
      setCurrentPage((p) => (p + 1) % pageCount);
    }, 3000);
    return () => clearInterval(id);
  }, [isPaused, pageCount]);

  return (
    <section className="section-standard bg-resort-cream py-16 md:py-24 min-h-[70vh] flex items-center">
      <div className="container">
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <h2 className="text-3xl font-serif text-resort-olive text-center">Testimonios</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((group, pageIdx) => (
                <div key={pageIdx} className="grid grid-cols-1 md:grid-cols-4 gap-5 min-w-full">
                  {group.map((testimonial, index) => (
                    <Card key={`${pageIdx}-${index}`} className="h-full flex flex-col text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="mb-4">
                        <p className="text-xs md:text-sm text-resort-slate mb-3">{testimonial.date}</p>
                        <div className="flex justify-center mb-5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-resort-gold text-resort-gold" />
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-sm md:text-base text-resort-slate mb-6 leading-relaxed">“{testimonial.text}”</blockquote>
                      <div className="mt-auto flex items-center justify-center gap-4">
                        <img
                          src={testimonial.avatar || 'https://i.pravatar.cc/80?u=default'}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-resort-olive text-sm md:text-base">{testimonial.name}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Anterior"
              onClick={prev}
              className="rounded-full p-2 text-resort-olive hover:bg-resort-olive/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={next}
              className="rounded-full p-2 text-resort-olive hover:bg-resort-olive/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === currentPage ? 'bg-resort-olive' : 'bg-resort-olive/30'}`}
              />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


