import { GlassCard } from '../ui/glass-card';

export function WeatherWidgetTest() {
  return (
    <GlassCard hover className="glass-widget w-72">
      <div className="space-y-2">
        <p className="text-small text-foreground-secondary">Weather</p>
        <h3 className="text-foreground">6°</h3>
        <p className="text-foreground-secondary">Örebro, clear sky</p>
        <p className="text-small text-foreground-secondary">Feels like 3°</p>
      </div>
    </GlassCard>
  );
}