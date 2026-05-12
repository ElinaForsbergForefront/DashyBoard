export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-foreground-secondary">{title}</h2>
    </div>
  );
}

export function FriendRow({
  username,
  displayName,
  children,
}: {
  username: string;
  displayName?: string | null;
  children: React.ReactNode;
}) {
  const label = displayName ?? username;
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-overlay px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-foreground-secondary">
          {label.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {displayName && <p className="text-xs text-muted">{username}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

export function IconButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-overlay px-2 py-1.5 text-xs text-muted hover:bg-overlay/80 hover:text-foreground"
    >
      {children}
    </button>
  );
}

export function EmptyText({ text }: { text: string }) {
  return <p className="rounded-xl bg-overlay px-3 py-3 text-sm text-muted">{text}</p>;
}
