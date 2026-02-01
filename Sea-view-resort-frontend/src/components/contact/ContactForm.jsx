import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ContactForm() {
  return (
    <section className="bg-white py-12">
      <div className="container">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center text-center">
            <label className="block text-sm font-semibold text-resort-slate mb-2">Nombre completo</label>
            <Input placeholder="Ej.: Juan Becker" className="bg-white" />
          </div>
          <div className="flex flex-col items-center text-center">
            <label className="block text-sm font-semibold text-resort-slate mb-2">Email</label>
            <Input type="email" placeholder="johnbecker@gmail.com" className="bg-white" />
          </div>
          <div className="md:col-span-2 flex flex-col items-center text-center">
            <label className="block text-sm font-semibold text-resort-slate mb-2">Mensaje</label>
            <textarea
              rows={8}
              placeholder="Escriba su mensaje"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-resort-olive bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <Button>Enviar</Button>
          </div>
        </form>
      </div>
    </section>
  );
}


