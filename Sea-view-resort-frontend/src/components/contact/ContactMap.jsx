export default function ContactMap() {
  return (
    <section className="bg-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 w-full h-[280px] md:h-[360px] rounded-md overflow-hidden border border-gray-200">
            <iframe
              title="mapa-caribe"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=21.1619,-86.8515&z=12&hl=es&output=embed"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-resort-slate">Nuestra ubicación</h3>
            <p className="text-sm text-resort-slate/80">
              Sea View Resort, costa del Caribe mexicano (Cancún, Q.R.). A pasos de playas turquesa y arena blanca.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-resort-slate">Teléfono</p>
              <a href="tel:+18001234567" className="text-resort-olive hover:underline">+1 (800) 123-4567</a>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-resort-slate">Email</p>
              <a href="mailto:reservas@seaviewresort.com" className="text-resort-olive hover:underline">reservas@seaviewresort.com</a>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-resort-slate">Horario de atención</p>
              <p className="text-resort-slate/80">Lun a Dom, 9:00 - 20:00 (GMT-5)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


