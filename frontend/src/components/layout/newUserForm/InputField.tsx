import { ChevronDown } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface InputOption {
  value: string;
  label?: string;
}

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  className: string;
  listId?: string;
  options?: InputOption[];
  onChange: (value: string) => void;
}

export const InputField = ({
  id,
  type,
  value,
  placeholder,
  disabled,
  className,
  listId,
  options,
  onChange,
}: InputFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasSuggestions = !!listId && !!options?.length;

  const filteredOptions = useMemo(() => {
    if (!hasSuggestions || !options) return [];
    const needle = value.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => option.value.toLowerCase().includes(needle));
  }, [hasSuggestions, options, value]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const showSuggestions = hasSuggestions && isOpen && filteredOptions.length > 0;
  const inputClassName = `${className} ${hasSuggestions ? 'pr-9' : ''}`.trim();

  const openSuggestions = () => {
    if (hasSuggestions) setIsOpen(true);
  };

  const closeSuggestions = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const moveActive = (direction: 1 | -1) => {
    if (filteredOptions.length === 0) return;
    setIsOpen(true);
    setActiveIndex((prev) => {
      if (direction === 1) return (prev + 1) % filteredOptions.length;
      return prev <= 0 ? filteredOptions.length - 1 : prev - 1;
    });
  };

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    closeSuggestions();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Enter':
        if (isOpen && activeIndex >= 0) {
          e.preventDefault();
          handleSelect(filteredOptions[activeIndex].value);
        }
        break;
      case 'Escape':
        closeSuggestions();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete={hasSuggestions ? 'list' : undefined}
        aria-expanded={hasSuggestions ? showSuggestions : undefined}
        aria-controls={listId}
        className={inputClassName}
        onFocus={openSuggestions}
        onChange={(e) => {
          onChange(e.target.value);
          openSuggestions();
        }}
        onKeyDown={handleKeyDown}
      />

      {hasSuggestions ? (
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
      ) : null}

      {showSuggestions ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-xl"
        >
          {filteredOptions.map((option, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={option.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={`w-full rounded px-3 py-2 text-left text-sm text-foreground transition-colors ${
                    isActive ? 'bg-primary/15 text-foreground' : 'hover:bg-overlay'
                  }`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(option.value);
                  }}
                >
                  {option.label ?? option.value}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
