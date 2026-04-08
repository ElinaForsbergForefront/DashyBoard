import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { PRESET_SYMBOLS } from '../../constants/currency';
import { CurrencySearchList } from './CurrencySearchList';

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
            <div className="flex flex-col">
              <CurrencySearchList onSelect={handleSelect} autoFocus />
              <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsSearching(false)}
                  className="w-full px-3 py-2 text-left text-xs text-muted transition hover:bg-overlay hover:text-foreground-secondary cursor-pointer"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
