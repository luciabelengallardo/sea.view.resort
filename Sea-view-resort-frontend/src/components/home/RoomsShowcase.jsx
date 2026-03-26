import { Card, CardContent } from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useRooms } from "../../context/RoomsContext";
import { DollarSign } from "lucide-react";

export default function RoomsShowcase() {
  const { rooms } = useRooms();

  // Mostrar máximo 3 habitaciones
  const displayRooms = rooms.slice(0, 3);

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
          <h2 className="text-3xl font-serif text-white mb-4">
            Habitaciones de lujo
          </h2>
          <p className="text-resort-cream">
            Cada espacio está diseñado para su confort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayRooms.length > 0 ? (
            displayRooms.map((room) => (
              <Link
                key={room.id || room._id}
                to={`/rooms/${room.id || room._id}`}
              >
                <Card className="overflow-hidden bg-white hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                  <div className="relative">
                    <img
                      src={
                        room.images && room.images.length > 0
                          ? room.images[0]
                          : "https://via.placeholder.com/400"
                      }
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-resort-olive text-white px-3 py-1 rounded text-sm font-medium">
                      Disponible
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {room.name}
                    </h3>
                    <p className="text-sm text-resort-slate mb-3 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex items-center text-resort-olive font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-lg">{room.price}</span>
                      <span className="text-sm text-gray-500 ml-1 font-normal">
                        / noche
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center text-white">
              <p>No hay habitaciones disponibles en este momento</p>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/rooms">
            <Button size="lg" variant="outlineWhite">
              Ver todas las habitaciones
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
