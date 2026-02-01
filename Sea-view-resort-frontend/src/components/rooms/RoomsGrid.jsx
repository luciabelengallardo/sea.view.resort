import RoomCard from './RoomCard.jsx';
import { useRooms } from '../../context/RoomsContext.jsx'; 

export default function RoomsGrid() {
  const { rooms } = useRooms(); // 👈 obtenemos las habitaciones del contexto

  return (
    <section id="rooms-grid" className="py-14">
      <div className="container">
        {rooms.length === 0 ? (
          <p className="text-center text-gray-500">No hay habitaciones disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                title={room.name}
                imageUrl={room.images && room.images.length > 0 ? room.images[0] : "https://via.placeholder.com/400"}
                price={room.price}
                description={room.description}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

