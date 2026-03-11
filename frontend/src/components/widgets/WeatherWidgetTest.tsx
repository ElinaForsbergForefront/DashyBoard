import { GlassCard } from '../ui/glass-card';


//detta är ett exempel på hur man skriver sin widget och du ser den i glass-test sidan, alltså http://localhost:5173/glass-test
//TODO: Ta bort denna widget när vi är klara med att testa och implementera glass-komponenten i riktiga widgets och formulär.
export function WeatherWidgetTest() {
  return (
    <GlassCard className="glass-widget w-72">
      <div className="space-y-2">
        <p className="text-small text-foreground-secondary">Weather</p>
        <h3 className="text-foreground">6°</h3>
        <p className="text-foreground-secondary">Örebro, clear sky</p>
        <p className="text-small text-foreground-secondary">Feels like 3°</p>
      </div>
    </GlassCard>
  );
}