import { widgetRegistry } from '../components/widgets/widgetRegistry';
import { EditModeProvider } from '../context/EditModeContext';

const included = widgetRegistry.filter((w) => !w.isPremium);
const premium = widgetRegistry.filter((w) => w.isPremium);

function PremiumBadge() {
  return (
    <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning ring-1 ring-warning/30">
      Premium
    </span>
  );
}

function WidgetCard({ widget }: { widget: (typeof widgetRegistry)[number] }) {
  const Component = widget.component;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {widget.isPremium && <PremiumBadge />}
        <div className="pointer-events-none select-none">
          <Component />
        </div>
      </div>
      <p className="text-sm font-medium text-foreground-secondary">{widget.name}</p>
    </div>
  );
}

function WidgetSection({
  title,
  widgets,
}: {
  title: string;
  widgets: typeof widgetRegistry;
}) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-wrap gap-8">
        {widgets.map((w) => (
          <WidgetCard key={w.id} widget={w} />
        ))}
      </div>
    </section>
  );
}

export const Widgets = () => {
  return (
    <EditModeProvider>
      <div className="max-w-5xl mx-auto space-y-12 px-6 py-8">
        <h1 className="text-3xl font-semibold text-foreground">Widgets</h1>
        <WidgetSection title="Included" widgets={included} />
        <WidgetSection title="Premium" widgets={premium} />
      </div>
    </EditModeProvider>
  );
};
