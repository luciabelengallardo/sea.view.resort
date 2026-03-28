import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  disabledDates = [],
}) {
  const [showCheckInCal, setShowCheckInCal] = useState(false);
  const [showCheckOutCal, setShowCheckOutCal] = useState(false);
  const [checkInMonth, setCheckInMonth] = useState(() => {
    if (checkIn) return new Date(checkIn);
    return new Date();
  });
  const [checkOutMonth, setCheckOutMonth] = useState(() => {
    if (checkOut) return new Date(checkOut);
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
  });

  const toISODate = (d) => {
    const date = new Date(d);
    return date.toISOString().split("T")[0];
  };

  // Obtener fecha local en formato YYYY-MM-DD (sin conversión a UTC)
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // convertir disabledDates a Set para búsqueda O(1)
  const disabledSet = new Set(disabledDates);

  // funcion para verificar si hay conflicto en el rango
  const hasConflictInRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      if (disabledSet.has(dateStr)) {
        return dateStr;
      }
    }
    return null;
  };

  const isDateDisabled = (date) => {
    const dateStr = toISODate(date);
    const todayStr = getLocalDateString();

    // bloquear fechas pasadas
    if (dateStr < todayStr) return true;

    // bloquear fechas ocupadas
    if (disabledSet.has(dateStr)) return true;

    return false;
  };

  const isDateSelected = (date) => {
    const dateStr = toISODate(date);
    if (checkIn === dateStr) return true;
    if (checkOut === dateStr) return true;
    return false;
  };

  const isDateInRange = (date) => {
    const dateStr = toISODate(date);
    if (!checkIn || !checkOut) return false;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const currentDate = new Date(date);
    return currentDate > checkInDate && currentDate < checkOutDate;
  };

  // funcion para generar días del calendario
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = (month) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    // dias vacios al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // dias del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i));
    }

    return days;
  };

  const handleDateClick = (date, isCheckOut = false) => {
    const dateStr = toISODate(date);
    const todayStr = getLocalDateString();

    // no permitir fechas pasadas
    if (dateStr < todayStr) {
      toast.error("No puedes seleccionar una fecha pasada.");
      return;
    }

    // verificar si la fecha seleccionada esta ocupada
    if (disabledSet.has(dateStr)) {
      toast.error(`La fecha ${dateStr} no está disponible.`);
      return;
    }

    if (isCheckOut) {
      // verificar si hay conflicto en el rango
      if (checkIn) {
        const conflictDate = hasConflictInRange(checkIn, dateStr);
        if (conflictDate) {
          toast.error(`La fecha ${conflictDate} en el rango está ocupada.`);
          return;
        }
      }
      onChange("checkOut", dateStr);
      setShowCheckOutCal(false);
    } else {
      // si ya hay un checkout, verificar si hay conflicto en el rango
      if (checkOut) {
        const conflictDate = hasConflictInRange(dateStr, checkOut);
        if (conflictDate) {
          toast.error(`La fecha ${conflictDate} en el rango está ocupada.`);
          return;
        }
      }
      onChange("checkIn", dateStr);
      setShowCheckInCal(false);
    }
  };

  const CalendarComponent = ({
    month,
    isCheckOut,
    onPrevMonth,
    onNextMonth,
  }) => {
    const days = renderCalendar(month);
    const monthName = month.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-72">
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-white/80 bg-white/60 backdrop-blur-sm rounded-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h3 className="font-semibold text-sm capitalize">{monthName}</h3>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-white/80 bg-white/60 backdrop-blur-sm rounded-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* dias de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, idx) => (
            <div
              key={`${day}-${idx}`}
              className="text-center text-xs font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* dias */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="h-8"></div>;
            }

            const disabled = isDateDisabled(date);
            const selected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const dateStr = toISODate(date);
            const isOccupied = disabledSet.has(dateStr);
            const todayStr = getLocalDateString();
            const isPast = dateStr < todayStr;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  if (!disabled) {
                    handleDateClick(date, isCheckOut);
                  }
                }}
                disabled={disabled}
                className={`h-8 text-xs rounded relative transition-colors ${
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selected
                      ? "bg-blue-600 text-white font-semibold"
                      : inRange
                        ? "bg-blue-100 text-blue-900"
                        : isPast
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : isOccupied
                            ? "bg-red-100 text-red-600 cursor-not-allowed"
                            : "hover:bg-blue-50 text-gray-700"
                }`}
                title={
                  isOccupied
                    ? "Fecha ocupada"
                    : isPast
                      ? "Fecha pasada"
                      : selected
                        ? "Fecha seleccionada"
                        : inRange
                          ? "En rango"
                          : "Disponible"
                }
              >
                {date.getDate()}
                {isOccupied && (
                  <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-red-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* inputs lado a lado */}
      <div className="grid grid-cols-2 gap-3">
        {/* checkin */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0 w-full overflow-hidden">
            <Calendar className="w-4 h-4" />
            <span className="truncate">Check-in</span>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              value={checkIn || ""}
              readOnly
              placeholder="Selecciona fecha"
              onClick={() => setShowCheckInCal(!showCheckInCal)}
              className="flex h-10 w-full items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-resort-olive focus:border-resort-olive cursor-pointer hover:border-blue-400"
            />
            {showCheckInCal && (
              <div className="absolute top-full left-0 mt-2 z-10">
                <CalendarComponent
                  month={checkInMonth}
                  isCheckOut={false}
                  onPrevMonth={() => {
                    const prev = new Date(checkInMonth);
                    prev.setMonth(prev.getMonth() - 1);
                    setCheckInMonth(prev);
                  }}
                  onNextMonth={() => {
                    const next = new Date(checkInMonth);
                    next.setMonth(next.getMonth() + 1);
                    setCheckInMonth(next);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* check-out */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-sm md:text-xs text-resort-slate whitespace-nowrap shrink min-w-0 w-full overflow-hidden">
            <CalendarDays className="w-4 h-4" />
            <span className="truncate">Check-out</span>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              value={checkOut || ""}
              readOnly
              placeholder="Selecciona fecha"
              onClick={() => setShowCheckOutCal(!showCheckOutCal)}
              className="flex h-10 w-full items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-resort-olive focus:border-resort-olive cursor-pointer hover:border-blue-400"
            />
            {showCheckOutCal && (
              <div className="absolute top-full left-0 mt-2 z-10">
                <CalendarComponent
                  month={checkOutMonth}
                  isCheckOut={true}
                  onPrevMonth={() => {
                    const prev = new Date(checkOutMonth);
                    prev.setMonth(prev.getMonth() - 1);
                    setCheckOutMonth(prev);
                  }}
                  onNextMonth={() => {
                    const next = new Date(checkOutMonth);
                    next.setMonth(next.getMonth() + 1);
                    setCheckOutMonth(next);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
