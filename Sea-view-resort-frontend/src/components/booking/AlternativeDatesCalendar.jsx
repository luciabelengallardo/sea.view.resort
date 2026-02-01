import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../ui/Modal';

function toISODateString(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getMonthsRangeFromDates(dates) {
    if (!dates || dates.length === 0) return [];
    const sorted = [...dates]
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());
    const start = new Date(sorted[0].getFullYear(), sorted[0].getMonth(), 1);
    const end = new Date(sorted[sorted.length - 1].getFullYear(), sorted[sorted.length - 1].getMonth(), 1);

    const months = [];
    const cursor = new Date(start);
    while (cursor <= end) {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
    }
    return months;
}

export default function AlternativeDatesCalendar({ isOpen, onClose, dates = [], onSelect, asModal = true, title = 'Selecciona una fecha', compact = false }) {
    const availableSet = useMemo(() => new Set(dates.map((d) => toISODateString(d))), [dates]);
    const months = useMemo(() => getMonthsRangeFromDates(dates), [dates]);
    const [monthIndex, setMonthIndex] = useState(0);
    useEffect(() => {
        setMonthIndex(0);
    }, [dates.length]);

    const monthDate = months[monthIndex];
    const hasMonths = months.length > 0;

    let monthContent = null;
    if (hasMonths) {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const offset = (firstDayOfMonth.getDay() + 6) % 7; // semana desde lunes

        const days = [];
        for (let i = 0; i < offset; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

        const monthLabel = monthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

        monthContent = (
            <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700 capitalize flex items-center justify-between">
                    <button
                        className="p-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
                        disabled={monthIndex <= 0}
                        aria-label="Mes anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span>{monthLabel}</span>
                    <button
                        className="p-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
                        disabled={monthIndex >= months.length - 1}
                        aria-label="Mes siguiente"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-4 py-3">
                    <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
                        {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((d, i) => {
                            if (!d) return <div key={`empty-${i}`} />;
                            const key = toISODateString(d);
                            const isAvailable = availableSet.has(key);
                            return (
                                <button
                                    key={key}
                                    disabled={!isAvailable}
                                    onClick={() => {
                                        if (isAvailable) {
                                            onSelect?.(d);
                                            if (asModal) onClose?.();
                                        }
                                    }}
                                    className={
                                        `aspect-square rounded-md text-sm flex items-center justify-center ` +
                                        (isAvailable
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                            : 'text-gray-400 cursor-not-allowed')
                                    }
                                >
                                    {d.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    } else {
        monthContent = (
            <div className="text-sm text-gray-500">No hay fechas alternativas disponibles.</div>
        );
    }

    const CalendarContent = (
        <div className={`bg-white rounded-2xl shadow ${compact ? 'p-3' : 'p-4 sm:p-6'}`}>
            <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-4'}`}>
                <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold`}>{title}</h3>
                {asModal && (
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 underline">Cerrar</button>
                )}
            </div>
            {hasMonths ? (
                <div className={compact ? 'rounded-xl border' : ''}>
                    {/* In compact mode, shrink paddings and cells */}
                    {compact ? (
                        <div className="border rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 font-medium text-gray-700 capitalize flex items-center justify-between">
                                <button
                                    className="p-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                    onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
                                    disabled={monthIndex <= 0}
                                    aria-label="Mes anterior"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm">{monthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                                <button
                                    className="p-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                    onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
                                    disabled={monthIndex >= months.length - 1}
                                    aria-label="Mes siguiente"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="px-3 py-2">
                                <div className="grid grid-cols-7 text-center text-[11px] text-gray-500 mb-1">
                                    {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map((d) => (
                                        <div key={d}>{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {(() => {
                                        const year = monthDate.getFullYear();
                                        const month = monthDate.getMonth();
                                        const firstDayOfMonth = new Date(year, month, 1);
                                        const lastDayOfMonth = new Date(year, month + 1, 0);
                                        const daysInMonth = lastDayOfMonth.getDate();
                                        const offset = (firstDayOfMonth.getDay() + 6) % 7;
                                        const cells = [];
                                        for (let i = 0; i < offset; i++) cells.push(null);
                                        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
                                        return cells.map((d, i) => {
                                            if (!d) return <div key={`empty-${i}`} />;
                                            const key = toISODateString(d);
                                            const isAvailable = availableSet.has(key);
                                            return (
                                                <button
                                                    key={key}
                                                    disabled={!isAvailable}
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            onSelect?.(d);
                                                            if (asModal) onClose?.();
                                                        }
                                                    }}
                                                    className={`h-8 w-8 mx-auto rounded-md text-xs flex items-center justify-center ` +
                                                        (isAvailable ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 'text-gray-400 cursor-not-allowed')}
                                                >
                                                    {d.getDate()}
                                                </button>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        monthContent
                    )}
                </div>
            ) : (
                <div className="text-sm text-gray-500">No hay fechas alternativas disponibles.</div>
            )}
        </div>
    );

    if (!asModal) {
        return CalendarContent;
    }

    return (
        <Modal open={isOpen} onClose={onClose} size="lg" lockScroll trapFocus>
            {CalendarContent}
        </Modal>
    );
}


