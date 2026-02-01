import React from 'react';
import { Button } from '../ui/Button';

export default function ImageGalleryModal({ isOpen, onClose, images = [], currentIndex = 0, onIndexChange, title = '' }) {
  if (!isOpen || !images || images.length === 0) return null;

  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h4 className="text-lg font-semibold text-gray-900 truncate mr-6">{title}</h4>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </div>
        <div className="relative bg-black flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`img-${currentIndex}`}
            className="max-h-[70vh] w-auto object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 grid place-items-center shadow"
                onClick={prevImage}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 grid place-items-center shadow"
                onClick={nextImage}
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="px-5 py-3 bg-gray-50 border-t overflow-x-auto">
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onIndexChange(idx)}
                  className={`rounded-md ring-2 ${idx === currentIndex ? "ring-resort-olive" : "ring-transparent"}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-16 h-16 object-cover rounded-md" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

