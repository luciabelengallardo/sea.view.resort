import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
} from "lucide-react";
import { useRooms } from "../context/RoomsContext";
import Gallery from "../components/rooms/Gallery.jsx";
import Features from "../components/rooms/Features.jsx";
import Amenities from "../components/rooms/Amenities.jsx";
import BookingSidebar from "../components/rooms/BookingSidebar.jsx";
import { Card, CardContent } from "../components/ui/Card";

const amenities = [
  { icon: Wifi, label: "WiFi gratuito" },
  { icon: Car, label: "Estacionamiento con valet" },
  { icon: Coffee, label: "Room Service 24/7" },
  { icon: Waves, label: "Acceso a spa" },
  { icon: Dumbbell, label: "Gimnasio" },
  { icon: Utensils, label: "Gastronomía premium" },
];

export default function RoomDetail() {
  const { id } = useParams();
  const { rooms } = useRooms();

  const room = useMemo(
    () => rooms.find((r) => r.id === parseInt(id, 10) || r._id === id),
    [id, rooms],
  );

  if (!room) return <p className="p-8 text-center">Habitación no encontrada</p>;

  return (
    <div className="min-h-screen bg-resort-cream">
      <main className="container px-4 py-8">
        <div className="mb-6">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-resort-olive hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Volver a habitaciones
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display text-gray-900 mb-3">
            {room.name}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Gallery images={room.images ? room.images : [room.image]} />

            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Descripción
                </h3>
                {room.description.split("\n").map((line, i) => (
                  <p key={i} className="text-resort-slate mb-1 relative pl-6">
                    <span className="absolute left-0 top-2 w-2 h-2 bg-resort-olive rounded-full"></span>
                    {line}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Features features={room.features || []} />
            <Amenities items={amenities} />
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar
              pricePerNight={room.price}
              roomName={room.name}
              roomId={room._id || room.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
