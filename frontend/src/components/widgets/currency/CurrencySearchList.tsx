import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useCurrencySearch } from '../../../hooks/useCurrencySearch';

interface CurrencySearchListProps {
  onSelect: (symbol: string) => void;
  autoFocus?: boolean;
}

export function CurrencySearchList({ onSelect, autoFocus = false }: CurrencySearchListProps) {
  const { query, results, isSearching, handleSearchChange } = useCurrencySearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-2 border-b px-3 py-2"
        style={{ borderColor: 'var(--glass-border)' }}
      >
        <Search size={12} className="text-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search symbol..."
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-placeholder outline-none"
        />
        {isSearching && (
          <div className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent shrink-0" />
        )}
      </div>

      <div className="max-h-40 overflow-y-auto py-1">
        {results.map((item) => (
          <button
            key={item.symbol}
            type="button"
            onClick={() => onSelect(item.symbol)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-overlay cursor-pointer"
          >
            {item.logoUrl && <img src={item.logoUrl} alt="" className="h-4 w-4 rounded shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{item.symbol}</p>
              <p className="truncate text-[10px] text-muted">{item.shortName}</p>
            </div>
            <span className="shrink-0 text-[10px] text-muted">{item.quoteType}</span>
          </button>
        ))}

        {query.length >= 2 && !isSearching && results.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted">No results found.</p>
        )}

        {query.length < 2 && <p className="px-3 py-2 text-xs text-muted">Type to search...</p>}
      </div>
    </div>
  );
}
