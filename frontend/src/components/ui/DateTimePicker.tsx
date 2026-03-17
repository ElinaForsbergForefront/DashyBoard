import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { sv } from 'react-day-picker/locale';

interface DateTimePickerProps {
    value: string; // datetime-local format: "YYYY-MM-DDTHH:mm"
    onChange: (value: string) => void;
    placeholder?: string;
}

function toDateParts(value: string): { date: Date | undefined; time: string } {
    if (!value) return { date: undefined, time: '09:00' };
    const [datePart, timePart] = value.split('T');
    return {
        date: datePart ? new Date(`${datePart}T12:00:00`) : undefined,
        time: timePart ?? '09:00',
    };
}

function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDisplay(value: string): string {
    if (!value) return '';
    const [datePart, timePart] = value.split('T');
    if (!datePart) return '';
    const date = new Date(`${datePart}T12:00:00`);
    const dayLabel = new Intl.DateTimeFormat('sv-SE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    }).format(date);
    return timePart ? `${dayLabel} kl ${timePart}` : dayLabel;
}

export function DateTimePicker({ value, onChange, placeholder = 'Välj datum & tid' }: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { date: selectedDate, time } = toDateParts(value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDaySelect = (day: Date | undefined) => {
        if (!day) return;
        onChange(`${toLocalDateString(day)}T${time}`);
    };

    const handleTimeChange = (newTime: string) => {
        const datePart = selectedDate ? toLocalDateString(selectedDate) : '';
        if (datePart) onChange(`${datePart}T${newTime}`);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full rounded-md border border-border bg-card px-3 py-2 text-left text-sm text-foreground outline-none focus:border-primary"
            >
                {value ? formatDisplay(value) : <span className="text-muted">{placeholder}</span>}
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-64 rounded-xl border border-border bg-card shadow-2xl">
                    <DayPicker
                        mode="single"
                        locale={sv}
                        selected={selectedDate}
                        onSelect={handleDaySelect}
                        defaultMonth={selectedDate ?? new Date()}
                        classNames={{
                            root: 'p-3',
                            months: 'flex flex-col',
                            month: 'space-y-3',
                            month_caption: 'flex items-center justify-between px-1 mb-1',
                            caption_label: 'text-sm font-semibold text-foreground capitalize',
                            nav: 'flex items-center gap-1',
                            button_previous:
                                'flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white/10 hover:text-foreground transition-colors',
                            button_next:
                                'flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-white/10 hover:text-foreground transition-colors',
                            weeks: 'space-y-1',
                            weekdays: 'grid grid-cols-7 mb-1',
                            weekday: 'text-center text-xs text-muted font-normal',
                            week: 'grid grid-cols-7',
                            day: 'flex items-center justify-center',
                            day_button:
                                'h-8 w-8 rounded-md text-sm text-foreground transition-colors hover:bg-white/10 focus:outline-none',
                            selected: '[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary',
                            today: '[&>button]:font-bold [&>button]:text-primary',
                            outside: '[&>button]:text-muted/40',
                            disabled: '[&>button]:opacity-30 [&>button]:cursor-not-allowed',
                        }}
                    />

                    <div className="mx-3 mb-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                        <span className="text-xs text-muted">Tid</span>
                        <input
                            type="time"
                            value={time}
                            onChange={(event) => handleTimeChange(event.target.value)}
                            className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                        />
                    </div>

                    <div className="px-3 pb-3">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="w-full rounded-md bg-primary py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                        >
                            Klar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
