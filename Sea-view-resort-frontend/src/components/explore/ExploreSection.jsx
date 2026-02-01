import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';

export default function ExploreSection({ imageUrl, imageUrls = [], title, description, intervalMs = 2500 }) {
  const images = (imageUrls && imageUrls.length > 0) ? imageUrls : (imageUrl ? [imageUrl] : []);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);
  return (
    <div className="relative pb-28 md:pb-36">
      <div className="relative rounded-2xl overflow-visible">
        <div className="relative w-full h-[520px] rounded-2xl overflow-hidden">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4 md:px-6 z-10">
          <Card className="mx-auto w-[92%] md:max-w-4xl shadow-lg">
            <CardContent className="py-8 md:py-10">
              <h3 className="text-center font-serif text-xl md:text-2xl text-gray-900 mb-3">{title}</h3>
              <p className="text-center text-lg text-gray-900 leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


