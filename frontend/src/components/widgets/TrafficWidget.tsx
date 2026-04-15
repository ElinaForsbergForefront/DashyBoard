import { useGetDeparturesQuery } from '../../api/endpoints/traffic';
import type { TimetableEntryDto } from '../../api/types/traffic';
import { GlassCard } from '../ui/glass-card';


/*
# Använda hooks i komponenter

```typescript
import { useGetMinResursQuery, useUppdateraMinResursMutation } from '../api/endpoints/minDomän';

const MinKomponent = () => {
  // Query – hämtar data automatiskt
  const { data, isLoading, error } = useGetMinResursQuery('mitt-id');

  // Mutation – anropas manuellt
  const [uppdatera] = useUppdateraMinResursMutation();

  const hanteraSpara = async () => {
    await uppdatera({ id: 'mitt-id', namn: 'Nytt namn' }).unwrap();
  };a
};
*/

const SITE_ID = 'YOUR_SITE_ID'; // replace with actual site ID

export function TrafficWidget() {
    const { data: departures = [], isLoading, isError } = useGetDeparturesQuery(SITE_ID);

    const showEmptyState = !isLoading && !isError && departures.length === 0;

    return (
        <GlassCard className="glass-widget w-72">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground-secondary">Departures</h3>
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-overlay px-2 py-0.5 text-xs text-muted">
                        {departures.length}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
                        >
                            Edit
                        </button>
                    </div>
                </div>

                {isLoading && <p className="text-xs text-muted">Loading departures...</p>}

                {isError && (
                    <p className="text-xs text-muted">Could not fetch departures at this time.</p>
                )}

                {showEmptyState && <p className="text-xs text-muted">No departures found.</p>}

                {!isLoading && !isError && departures.length > 0 && (
                    <div className="space-y-2">
                        {departures.map((departure: TimetableEntryDto, index: number) => (
                            <div key={index} className="rounded-xl bg-overlay px-3 py-2">
                                <p className="text-sm font-medium text-foreground">{departure.line} – {departure.direction}</p>
                                <p className="text-xs text-muted">{departure.scheduled.toString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

export default TrafficWidget;