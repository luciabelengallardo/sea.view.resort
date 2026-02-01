import { Bed } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

export default function RoomTypeSelect({ value, onChange, rooms }) {
    return (
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0 w-full overflow-hidden">
                <Bed className="w-4 h-4" />
                <span className="truncate">Tipo de habitación</span>
            </div>
            <div className="w-full">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione una habitación" />
                    </SelectTrigger>
                    <SelectContent>
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <SelectItem key={room.id} value={room.name}>
                                    {room.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="" disabled>
                                No hay habitaciones disponibles
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}


