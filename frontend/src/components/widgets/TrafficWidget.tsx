import { useGetDeparturesQuery, useGetDeparturesAtTimeQuery } from '../../api/endpoints/traffic';
import type { TimetableEntryDto } from '../../api/types/traffic';
import { TrafficForm } from '../forms/TrafficForm';
import { GlassCard } from '../ui/glass-card';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditModeContext } from '../../context/EditModeContext';

import { BusFrontIcon, HelpCircle, TrainFrontIcon, TramFrontIcon, type LucideIcon } from 'lucide-react';

    const scheduledFormatter = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
    });

    const transportIcons: Record<string, LucideIcon> = {
        BUS: BusFrontIcon,
        TRAM: TramFrontIcon,
        TRAIN: TrainFrontIcon
    };

    function TransportIcon({ mode }: { mode: string }) {
        const Icon = transportIcons[mode.toUpperCase()] ?? HelpCircle;
        return <Icon size={30} className="text-muted" />;
    }



export function TrafficWidget() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { isEditMode } = useEditModeContext();

    const [siteId, setSiteId] = useState<string | null>(null);
    const [stationName, setStationName] = useState<string | null>(null);
    const [dateTime, setDateTime] = useState<string | null>(null);
    const [transportModes, setTransportModes] = useState<string[]>(['BUS', 'TRAM', 'TRAIN']);

    const { data: departures = [], isLoading, isError } = useGetDeparturesQuery(
        siteId ?? '',
        { skip: !siteId || !!dateTime, pollingInterval: 30 * 1000 }
    );

    const { data: timedDepartures = [], isLoading: isTimedLoading, isError: isTimedError } = useGetDeparturesAtTimeQuery(
        { siteId: siteId ?? '', dateTime: dateTime ?? '' },
        { skip: !siteId || !dateTime , pollingInterval: 30 * 1000 }      
    );

    const activeDepartures = dateTime ? timedDepartures : departures;

    // Filter to departures within the next 40 minutes and limit to 20 results - only with the chosen transport modes (Bus, tram, train)
    const visibleDepartures = activeDepartures
    .filter(d => transportModes.includes(d.transportMode.toUpperCase()))
    .filter(d => (new Date(d.scheduled).getTime() - Date.now()) <= 40 * 60 * 1000)
    .slice(0, 20);

    const activeLoading = isLoading || isTimedLoading;
    const activeError = isError || isTimedError;

    const showEmptyState = siteId !== null && !activeLoading && !activeError && activeDepartures.length === 0;

    const handleFormSuccess = (config: { siteId: string; stationName: string; dateTime?: string; transportModes: string[] }) => {
        setSiteId(config.siteId);
        setStationName(config.stationName);
        setDateTime(config.dateTime ?? null);
        setIsEditModalOpen(false);
        setTransportModes(config.transportModes);
    };


    return (
        <>
            <GlassCard className="glass-widget w-110">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium text-foreground-secondary">Local traffic</h3>
                            <p className="text-lg text-muted">{stationName ?? 'No station selected'}</p>
                            {dateTime && (
                                <p className="text-xs text-muted">{scheduledFormatter.format(new Date(dateTime))}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-overlay px-2 py-0.5 text-xs text-muted">
                                {visibleDepartures.length}
                            </span>
                            {isEditMode && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {activeLoading && <p className="text-xs text-muted">Loading departures...</p>}

                    {activeError && (
                        <p className="text-xs text-muted">Could not fetch departures at this time.</p>
                    )}

                    {showEmptyState && <p className="text-xs text-muted">No departures found.</p>}

                    {!activeLoading && !activeError && activeDepartures.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto subtle-scrollbar pr-4">
                            {visibleDepartures.map((departure: TimetableEntryDto, index) => (
                                <div key={`${departure.transportMode}-${departure.line}-${departure.scheduled}-${departure.direction}-${departure.platform}-${index}`} className="rounded-xl bg-overlay px-3 py-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <div className="shrink-0"><TransportIcon mode={departure.transportMode} /></div>
                                            <div>
                                                <div className="flex gap-4 text-sm font-medium text-foreground">
                                                    <p >{departure.line}</p>
                                                    <p className='truncate'>{departure.direction}</p>
                                                </div>
                                                
                                            <p className="text-xs text-muted">{new Date(departure.scheduled).toTimeString().slice(0, 5)}</p>
                                            {departure.canceled && <p className="text-xs text-destructive">Canceled</p>}
                                            {!departure.canceled && Math.round(departure.delay / 60) > 0 && (
                                                <p className="text-xs text-warning">Delayed: +{Math.round(departure.delay / 60)} min</p>
                                            )}
                                        </div>
                                    </div>
                                        {(() => {
                                        const mins = Math.round((new Date(departure.scheduled).getTime() - Date.now()) / 60000);
                                        return mins >= 0 && mins <= 10
                                            ? <span className="shrink-0 text-xs font-medium text-warning">{mins === 0 ? 'Now' : `${mins} min`}</span>
                                            : null;
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>                      
            </GlassCard>


            {isEditModalOpen && createPortal(
                <TrafficEditModal 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSuccess={handleFormSuccess}
                />,
                document.body
            )}
        </>
    );
}

function TrafficEditModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: (config: { siteId: string; stationName: string; dateTime?: string; transportModes: string[] }) => void;
}) {
    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-4"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Choose station</h4>
                    <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground">
                        Close
                    </button>
                </div>
                <TrafficForm onSuccess={onSuccess} />
            </div>
        </div>
    );
}

export default TrafficWidget;