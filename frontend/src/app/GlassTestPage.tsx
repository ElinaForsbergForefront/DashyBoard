import { GlassFormTest } from '../components/forms/GlassFormTest';
import { WeatherWidgetTest } from '../components/widgets/WeatherWidgetTest';

export function GlassTestPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1>Glass component test</h1>
          <p className="text-foreground-secondary">
            Testar glass-komponenten för både widget och formulär.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <WeatherWidgetTest />
          <GlassFormTest />
        </div>
      </div>
    </div>
  );
}