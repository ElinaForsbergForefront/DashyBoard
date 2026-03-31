import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { useCurrencySearch } from '../../hooks/useCurrencySearch';

const PRESET_SYMBOLS = [
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'EURUSD=X', name: 'EUR/USD' },
  { symbol: 'GBPUSD=X', name: 'GBP/USD' },
] as const;

interface CurrencyDropdownProps {
  currentSymbol: string;
  currentName: string | undefined;
  onSelect: (symbol: string) => void;
}

export function CurrencyDropdown({ currentSymbol, currentName, onSelect }: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setIsOpen(false);
    setIsSearching(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-md transition hover:bg-overlay px-1 -ml-1 cursor-pointer"
      >
        <div className="text-left">
          <h3 className="text-sm font-medium text-foreground-secondary">
            {currentName ?? currentSymbol}
          </h3>
          <p className="text-xs text-muted">{currentSymbol}</p>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden backdrop-blur-2xl"
          style={{
            background: 'var(--color-elevated)',
            borderColor: 'var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          {!isSearching ? (
            <>
              <ul className="py-1">
                {PRESET_SYMBOLS.map((item) => (
                  <li key={item.symbol}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.symbol)}
                      className={`cursor-pointer flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-overlay
                        ${item.symbol === currentSymbol ? 'text-primary' : 'text-foreground'}`}
                    >
                      <span className="text-xs font-medium">{item.symbol}</span>
                      <span className="text-xs text-muted">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium text-primary transition hover:bg-overlay cursor-pointer"
                >
                  <Plus size={12} />
                  Add new
                </button>
              </div>
            </>
          ) : (
            <SearchPanel onSelect={handleSelect} onBack={() => setIsSearching(false)} />
          )}
        </div>
      )}
    </div>
  );
}

function SearchPanel({
  onSelect,
  onBack,
}: {
  onSelect: (symbol: string) => void;
  onBack: () => void;
}) {
  const { query, results, isSearching: isFetching, handleSearchChange } = useCurrencySearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-2 border-b px-3 py-2"
        style={{ borderColor: 'var(--glass-border)' }}
      >
        <Search size={12} className="text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search symbol..."
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-placeholder outline-none"
        />
        {isFetching && (
          <div className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent" />
        )}
      </div>

      <div className="max-h-40 overflow-y-auto py-1">
        {results.length > 0 &&
          results.map((item) => (
            <button
              key={item.symbol}
              type="button"
              onClick={() => onSelect(item.symbol)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-overlay cursor-pointer"
            >
              {item.logoUrl && <img src={item.logoUrl} alt="" className="h-4 w-4 rounded" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{item.symbol}</p>
                <p className="truncate text-[10px] text-muted">{item.shortName}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted">{item.quoteType}</span>
            </button>
          ))}

        {query.length >= 2 && !isFetching && results.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted">No results found.</p>
        )}

        {query.length < 2 && <p className="px-3 py-2 text-xs text-muted">Type to search...</p>}
      </div>

      <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <button
          type="button"
          onClick={onBack}
          className="w-full px-3 py-2 text-left text-xs text-muted transition hover:bg-overlay hover:text-foreground-secondary cursor-pointer"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
