import { useState } from 'react';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Galería de imágenes con navegación y puntos indicadores.
 *
 * Este componente se encarga únicamente de mostrar y navegar imágenes.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string[]} props.images - Lista de URLs de imágenes a renderizar.
 * @param {string} [props.altPrefix="Vista habitación"] - Prefijo para el atributo alt de cada imagen.
 * @returns {JSX.Element|null}
 */
export default function Gallery({ images = [], altPrefix = 'Vista habitación' }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((idx) => (idx + 1) % images.length);
    const prev = () => setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);

    if (!images || images.length === 0) return null;

    return (
        <div className="relative mb-8">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <img src={images[currentIndex]} alt={`${altPrefix} ${currentIndex + 1}`} className="w-full h-full object-cover transition-all duration-500" />
            </div>

            <Button
                variant="outline"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white h-10 w-10 p-0 rounded-full"
                onClick={prev}
                aria-label="Imagen anterior"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white h-10 w-10 p-0 rounded-full"
                onClick={next}
                aria-label="Imagen siguiente"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/60'}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Ir a imagen ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}


