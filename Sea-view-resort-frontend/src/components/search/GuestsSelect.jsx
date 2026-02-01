import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

export default function GuestsSelect({ value, onChange }) {
    return (
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0 w-full overflow-hidden">
                <Users className="w-4 h-4" />
                <span className="truncate">Huéspedes</span>
            </div>
            <div className="w-full">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="2 Adultos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Adulto</SelectItem>
                        <SelectItem value="2">2 Adultos</SelectItem>
                        <SelectItem value="3">3 Adultos</SelectItem>
                        <SelectItem value="4">4 Adultos</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}


