import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

export default function DestinationSelect({ value, onChange }) {
    return (
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0 w-full overflow-hidden">
                <MapPin className="w-4 h-4" />
                <span className="truncate">Destino</span>
            </div>
            <div className="w-full">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un destino" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="maldivas">Maldivas</SelectItem>
                        <SelectItem value="bali">Bali</SelectItem>
                        <SelectItem value="hawai">Hawái</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}


