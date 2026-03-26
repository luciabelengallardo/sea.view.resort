import { useState } from "react";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({
  images = [],
  altPrefix = "Vista habitación",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((idx) => (idx + 1) % images.length);
  const prev = () =>
    setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative mb-8">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={images[currentIndex]}
          alt={`${altPrefix} ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      <Button
        variant="outline"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white border-0 h-12 w-12 p-0 rounded-full shadow-lg transition-all"
        onClick={prev}
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white border-0 h-12 w-12 p-0 rounded-full shadow-lg transition-all"
        onClick={next}
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white/60"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
