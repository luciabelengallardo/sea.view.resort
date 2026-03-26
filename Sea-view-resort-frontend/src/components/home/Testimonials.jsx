import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    date: "3 Mar 2026",
    name: "Valentina Gómez",
    text: "Me encantó todo, súper limpio y la atención fue genial. La vista al mar hermosa.",
  },
  {
    date: "12 Mar 2025",
    name: "Lucas Fernández",
    text: "Buenas instalaciones y precio justo. Volvería sin dudarlo.",
  },
  {
    date: "25 Mar 2025",
    name: "Regina Delia",
    text: "Excelente servicio, todo muy cómodo. Ideal para descansar.",
  },
  {
    date: "8 Abr 2023",
    name: "Germán Alva",
    text: "La comida muy rica y las habitaciones amplias. Recomendado.",
  },
  {
    date: "19 Abr 2024",
    name: "María López",
    text: "Lugar tranquilo y el personal muy amable. Perfecto para relajarse.",
  },
  {
    date: "28 Abr 2023",
    name: "Andrés Pérez",
    text: "La habitación con vista al mar increíble. Volveríamos seguro.",
  },
  {
    date: "7 May 2025",
    name: "Sofía Martínez",
    text: "El spa está muy bueno y las instalaciones limpias. Nos gustó mucho.",
  },
  {
    date: "21 May 2024",
    name: "Diego Ramírez",
    text: "Todo bien organizado y cómodo. Buen servicio en general.",
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
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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

  // autoplay del carrusel
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
          <h2 className="text-3xl font-serif text-resort-olive text-center">
            Testimonios
          </h2>
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
                <div
                  key={pageIdx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-5 min-w-full"
                >
                  {group.map((testimonial, index) => (
                    <Card
                      key={`${pageIdx}-${index}`}
                      className="h-full flex flex-col text-center p-6 md:p-8 hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4">
                        <p className="text-xs md:text-sm text-resort-slate mb-3">
                          {testimonial.date}
                        </p>
                        <div className="flex justify-center mb-5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-resort-gold text-resort-gold"
                            />
                          ))}
                        </div>
                      </div>
                      <blockquote className="text-sm md:text-base text-resort-slate mb-6 leading-relaxed">
                        “{testimonial.text}”
                      </blockquote>
                      <div className="mt-auto">
                        <p className="font-medium text-resort-olive text-sm md:text-base">
                          {testimonial.name}
                        </p>
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
                className={`h-1.5 w-1.5 rounded-full ${i === currentPage ? "bg-resort-olive" : "bg-resort-olive/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
