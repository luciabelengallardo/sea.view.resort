import { Card, CardContent } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const rooms = [
  {
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    available: '3 Rooms available',
    description: 'Television set, Extra sheets and breakfast',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    available: '4 Rooms available',
    description: 'Television set, Extra sheets, Breakfast, and fireplace',
  },
  {
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    available: '2 Rooms available',
    description:
      'Television set, Extra sheets, Breakfast, and fireplace, Console and best rest',
  },
];

export default function RoomsShowcase() {
  return (
    <section
      className="section-standard py-16 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-resort-slate/70"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-white mb-4">Habitaciones de lujo</h2>
          <p className="text-resort-cream">Cada espacio está diseñado para su confort</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <Card key={index} className="overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={room.image || '/placeholder.svg'} alt={`Room ${index + 1}`} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 bg-resort-olive text-white px-3 py-1 rounded text-sm">
                  {room.available}
                </div>
              </div>
              <CardContent>
                <p className="text-sm text-resort-slate">{room.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/rooms">
            <Button size="lg" variant="outlineWhite">Ver todas las habitaciones</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


