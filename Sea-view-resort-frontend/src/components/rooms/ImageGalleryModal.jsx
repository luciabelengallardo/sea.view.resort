import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGalleryModal({ open, onClose, images = [], initialIndex = 0 }) {
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (!open) return;
    setShow(true);
    setIndex(initialIndex);

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, initialIndex, images.length]);

  if (!open) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const modal = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-6xl h-[80vh] mx-4 transform rounded-lg overflow-hidden shadow-2xl transition-all duration-200 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <img src={images[index]} alt="room" className="absolute inset-0 w-full h-full object-contain bg-black" />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 bg-black/40 rounded-full">
              {images.map((src, i) => (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}


