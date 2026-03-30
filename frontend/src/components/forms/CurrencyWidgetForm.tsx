import { useCurrencySearch } from '../../hooks/useCurrencySearch';

interface CurrencyWidgetFormProps {
  onSuccess?: () => void;
}

export function CurrencyWidgetForm({ onSuccess }: CurrencyWidgetFormProps = {}) {
  const { query, results, isSearching, handleSearchChange } = useCurrencySearch();

  const handleSelect = (symbol: string) => {
    // TODO: persist selected symbol to widget config/state
    console.log('Selected currency symbol:', symbol);
    onSuccess?.();
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-3 space-y-3">
      <p className="text-sm font-medium text-foreground">Search symbol</p>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="e.g. EUR, Bitcoin, Apple..."
          className="w-full rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
        {isSearching && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <ul className="max-h-48 space-y-1 overflow-y-auto">
          {results.map((item) => (
            <li key={item.symbol}>
              <button
                type="button"
                onClick={() => handleSelect(item.symbol)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-overlay"
              >
                {item.logoUrl && <img src={item.logoUrl} alt="" className="h-5 w-5 rounded" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.symbol}</p>
                  <p className="truncate text-xs text-muted">{item.shortName}</p>
                </div>
                <span className="shrink-0 rounded bg-overlay px-1.5 py-0.5 text-[10px] text-muted">
                  {item.quoteType}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 2 && !isSearching && results.length === 0 && (
        <p className="text-xs text-muted">No results found.</p>
      )}
    </div>
  );
}
