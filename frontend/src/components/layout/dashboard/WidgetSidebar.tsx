export function WidgetSidebar() {
  return (
    <aside className="w-60 min-h-full bg-card border-r border-border flex flex-col gap-4 p-4 shrink-0">
      <div>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Widgets</h2>
        <p className="text-xs text-muted">Drag to add to your mirror</p>
      </div>
      <div className="flex flex-col gap-2">
        {/* Widget list */}
        <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted text-center">
          No widgets yet
        </div>
      </div>
    </aside>
  );
}
