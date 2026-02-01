import { Calendar, CalendarDays } from "lucide-react";
import { useRef } from "react";
import { Input } from "../ui/Input";

export default function DateRangePicker({ checkIn, checkOut, onChange }) {
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const today = new Date();
  const toISODate = (d) => d.toISOString().split("T")[0];
  const todayStr = toISODate(today);
  const checkInDate = checkIn ? new Date(checkIn) : today;
  const checkOutMinDate = new Date(checkInDate);
  checkOutMinDate.setDate(checkInDate.getDate() + 1);
  const checkOutMinStr = toISODate(checkOutMinDate);

  const openPicker = (ref) => {
    const el = ref?.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else {
      el.focus();
      el.click();
    }
  };
  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0">
          <Calendar className="w-4 h-4" />
          <span className="truncate">Check-in</span>
        </div>
        <div className="w-full relative">
          <Input
            type="date"
            value={checkIn}
            min={todayStr}
            onChange={(e) => onChange("checkIn", e.target.value)}
            className="date-input text-xs pr-10 md:pr-0 lg:pr-10 md:text-xs md:px-2 md:tracking-tight"
            ref={checkInRef}
          />
          <button
            type="button"
            onClick={() => openPicker(checkInRef)}
            className="md:hidden lg:block absolute inset-y-0 right-2 flex items-center text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 1 1 2 0v1zm15 6H3v11h18V8z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0">
          <CalendarDays className="w-4 h-4" />
          <span className="truncate">Check-out</span>
        </div>
        <div className="w-full relative">
          <Input
            type="date"
            value={checkOut}
            min={checkOutMinStr}
            onChange={(e) => onChange("checkOut", e.target.value)}
            className="date-input text-xs pr-10 md:pr-0 lg:pr-10 md:text-xs md:px-2 md:tracking-tight"
            ref={checkOutRef}
          />
          <button
            type="button"
            onClick={() => openPicker(checkOutRef)}
            className="md:hidden lg:block absolute inset-y-0 right-2 flex items-center text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 2a1 1 0 0 1 1 1v1h10V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 1 1 2 0v1zm15 6H3v11h18V8z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
