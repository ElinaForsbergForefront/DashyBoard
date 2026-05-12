import { useState } from 'react';
import { useGetStopsByNameQuery } from '../../api/endpoints/traffic';
import type { StationDto } from '../../api/types/traffic';
import { DateTimePicker } from '../ui/DateTimePicker';
import { FormCard } from '../ui/form-card';
import { BusFrontIcon, TrainFrontIcon, TramFrontIcon, type LucideIcon} from 'lucide-react';

interface TrafficFormProps {
    onSuccess?: (config: { siteId: string; stationName: string; dateTime?: string; transportModes: string[] }) => void;
}

export function TrafficForm({ onSuccess }: TrafficFormProps = {}) {
    const [searchInput, setSearchInput] = useState('');
    const [submittedName, setSubmittedName] = useState('');
    const [selectedStop, setSelectedStop] = useState<StationDto | null>(null);
    const [dateTime, setDateTime] = useState('');
    const [useSpecificTime, setUseSpecificTime] = useState(false);
    const [transportModes, setTransportModes] = useState<string[]>(['BUS', 'TRAM', 'TRAIN']);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const { data: stops = [], isLoading, isError } = useGetStopsByNameQuery(
        submittedName,
        { skip: !submittedName }
    );

    const toggleMode = (mode: string) => {
    setTransportModes(prev =>
        prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
};

    const handleSearch = () => {
        if (searchInput.trim()) {
            setSubmittedName(searchInput.trim());
            setSelectedStop(null);
            setShowResults(true);            
        }
    };

    const handleConfirm = () => {
        if (!selectedStop) return;

        if (useSpecificTime && dateTime) {
            const selectedDate = new Date(dateTime);
            const today = new Date();
            today.setHours(0, 0, 0, 0);  // strip time — compare dates only

            if (selectedDate < today) {
                setFeedback('Please select a date from today or later.');
                return;
            }
        }

        setFeedback(null);
        onSuccess?.({
            siteId: selectedStop.groupId ?? 'Unknown groupId',
            stationName: selectedStop.name ?? selectedStop.groupName ?? 'Unknown Station',
            dateTime: useSpecificTime && dateTime ? dateTime : undefined,
            transportModes
        });
    };

    return (
        <FormCard>

            <label className="flex flex-col gap-1 text-xs text-muted pt-2">
                Station
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Ex: Tekniska högskolan"
                        className="flex-1 rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
                    >
                        Search
                    </button>
                </div>
            </label>

            {isLoading && <p className="text-xs text-muted">Searching...</p>}
            {isError && <p className="text-xs text-muted">Could not fetch stops.</p>}

            {showResults && stops.length > 0 && (
                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto subtle-scrollbar pr-1">
                    {stops.slice(0, 10).map((stop) => (
                        <button
                            key={stop.id}
                            type="button"
                            onClick={() => {
                                setSelectedStop(stop);
                                setSearchInput(stop.name ?? '');
                                setSubmittedName('');
                                setShowResults(false);    
                            }}
                            className={`rounded-md border px-2 py-2 text-left text-sm text-foreground transition hover:bg-glass ${
                                selectedStop?.groupId === stop.groupId
                                    ? 'border-primary bg-overlay'
                                    : 'border-border bg-overlay'
                            }`}
                        >
                            {stop.name}
                        </button>
                    ))}
                </div>
            )}

            {selectedStop && (
                <>
                        <div className="flex justify-center gap-6 pt-2">
                            {([['BUS', BusFrontIcon], ['TRAM', TramFrontIcon], ['TRAIN', TrainFrontIcon]] as [string, LucideIcon][]).map(([mode, Icon]) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => toggleMode(mode)}
                                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                                        transportModes.includes(mode)
                                            ? 'border-primary bg-primary/20 text-foreground'
                                            : 'border-border bg-overlay text-muted'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {mode.charAt(0) + mode.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                        <label className="flex items-center gap-2 text-xs text-muted">
                        <div className="flex flex-col gap-1 text-xs text-muted w-full pt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex-1">   
                                    <DateTimePicker
                                        placeholder="Specific time (optional)"
                                        value={dateTime}
                                        onChange={(val) => {
                                            setDateTime(val);
                                            setUseSpecificTime(!!val);
                                        }}
                                    />
                                </div>
                                {dateTime && (
                                    <button
                                        type="button"
                                        onClick={() => { setDateTime(''); setUseSpecificTime(false); }}
                                        className="rounded-md border border-border px-2 py-2 text-xs text-muted hover:text-foreground transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                                </div>
                            </div>
                    </label>

                    {feedback && <p className="text-xs text-red-500">{feedback}</p>}
                    <button
                        type="button"                        
                        disabled={useSpecificTime && !dateTime}
                        onClick={handleConfirm}
                        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        Choose {selectedStop.name}
                    </button>
                </>
            )}
        </FormCard>
    );
}