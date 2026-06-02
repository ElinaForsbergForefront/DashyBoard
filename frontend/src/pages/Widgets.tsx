import { widgetRegistry, type WidgetType } from '../components/widgets/widgetRegistry';
import { EditModeProvider } from '../context/EditModeContext';
import { GRID_UNIT_CM, REFERENCE_SCALE } from '../constants/grid';
import { createMirrorWidgetDraft } from '../utils/createMirrorWidgetDraft';

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
  const naturalWidth = widget.cols * GRID_UNIT_CM * REFERENCE_SCALE;
  const naturalHeight = widget.rows * GRID_UNIT_CM * REFERENCE_SCALE;
  const previewWidget = createMirrorWidgetDraft(
    `preview-${widget.id}`,
    widget.id as WidgetType,
    0,
    0,
  );

  // Scale down for mobile/tablet — cap preview at 280px wide
  const mobileMaxWidth = 280;
  const mobileScale = Math.min(1, mobileMaxWidth / naturalWidth);
  const mobileDisplayWidth = Math.round(naturalWidth * mobileScale);
  const mobileDisplayHeight = Math.round(naturalHeight * mobileScale);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {widget.isPremium && <PremiumBadge />}
        {/* Desktop: natural size */}
        <div
          className="pointer-events-none select-none hidden xl:block"
          style={{ width: naturalWidth, height: naturalHeight }}
        >
          <Component widget={previewWidget} />
        </div>
        {/* Mobile/tablet: scaled down */}
        <div
          className="pointer-events-none select-none xl:hidden overflow-hidden"
          style={{ width: mobileDisplayWidth, height: mobileDisplayHeight }}
        >
          <div
            style={{
              width: naturalWidth,
              height: naturalHeight,
              transform: `scale(${mobileScale})`,
              transformOrigin: 'top left',
            }}
          >
            <Component widget={previewWidget} />
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground-secondary">{widget.name}</p>
    </div>
  );
}

function WidgetSection({ title, widgets }: { title: string; widgets: typeof widgetRegistry }) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-wrap gap-8 justify-center xl:justify-start">
        {widgets.map((w) => (
          <WidgetCard key={w.id} widget={w} />
        ))}
      </div>
    </section>
  );
}

export const Widgets = () => {
  return (
    <EditModeProvider initialEditMode={false}>
      <div className="overflow-y-auto flex-1">
      <div className="max-w-5xl mx-auto space-y-12 px-6 py-8">
        <h1 className="text-3xl font-semibold text-foreground">Widgets</h1>
        <WidgetSection title="Included" widgets={included} />
        <WidgetSection title="Premium" widgets={premium} />
      </div>
      </div>
    </EditModeProvider>
  );
};
