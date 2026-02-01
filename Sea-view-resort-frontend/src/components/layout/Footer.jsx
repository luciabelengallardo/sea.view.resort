import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const quickLinks = [
  { label: "Explorar", to: "/explore" },
  { label: "Habitaciones", to: "/rooms" },
  { label: "Contacto", to: "/contact" },
  { label: "Nosotros", to: "/about" },
];

const companyLinks = [
  "Política de privacidad",
  "Términos del servicio",
  "Preguntas frecuentes",
  "Aviso legal",
];

export default function Footer() {
  return (
    <footer className="bg-resort-olive text-white py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">Sea View Resort</h3>
          </div>

          <div>
            <h4 className="font-medium mb-4">Accesos rápidos</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-resort-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Compañía</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link}>
                  <span className="hover:text-resort-gold transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Boletín</h4>
            <p className="text-sm mb-4">
              Reciba novedades y beneficios exclusivos.
            </p>
            <div className="flex gap-2 mb-6">
              <Input
                type="email"
                placeholder="Ingrese su correo"
                className="bg-white text-gray-900 text-sm flex-1"
              />
              <Button variant="secondary">Suscribirse</Button>
            </div>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <Link key={index} to="/404" aria-label={`Ir a ${Icon.name}`} className="hover:text-resort-cyan transition-colors">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-resort-taupe mt-8 pt-8 text-center text-sm">
          <p>Sea View Resort - 2025</p>
        </div>
      </div>
    </footer>
  );
}
