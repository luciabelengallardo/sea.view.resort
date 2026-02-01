import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <section className="container min-h-[70vh] flex flex-col items-center justify-center text-center gap-8 py-16">
      <h1 className="select-none font-extrabold tracking-tight text-black leading-none">
        <span className="block text-[20vw] md:text-[16vw] lg:text-[12vw]">Oops!</span>
      </h1>

      <div className="max-w-2xl space-y-4">
bi        <p className="text-2xl md:text-3xl font-semibold">404 - Página no encontrada.</p>
        <p className="text-gray-600 md:text-lg">Esta página tomó un desvío inesperado. Su suite lo sigue esperando.</p>
        <p className="text-gray-600 md:text-lg">Regrese y continúe disfrutando del lujo.</p>
      </div>

      <Button size="lg" className="px-8">
        <a href="/">Volver al inicio</a>
      </Button>
    </section>
  );
}


