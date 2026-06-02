export function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{title}</h2>
  );
}

export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
      {children}
    </div>
  );
}

function UserAvatar({ name, indicator }: { name: string; indicator?: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
        {name.slice(0, 1).toUpperCase()}
      </div>
      {indicator && (
        <span className="absolute -right-1 -top-1 text-[11px] leading-none">{indicator}</span>
      )}
    </div>
  );
}

export function FriendRow({
  username,
  displayName,
  indicator,
  children,
}: {
  username: string;
  displayName?: string | null;
  indicator?: React.ReactNode;
  children: React.ReactNode;
}) {
  const label = displayName ?? username;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar name={label} indicator={indicator} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{label}</p>
          {displayName && <p className="text-xs text-muted truncate">{username}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">{children}</div>
    </div>
  );
}

export function IconButton({
  children,
  onClick,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}) {
  const styles = {
    default: 'text-muted hover:text-foreground hover:bg-overlay',
    destructive: 'text-muted hover:text-destructive hover:bg-destructive/10',
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function EmptyText({ text }: { text: string }) {
  return <p className="px-4 py-4 text-sm text-muted">{text}</p>;
}
