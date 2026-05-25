import { useState, type FormEvent } from 'react';
import type { CurrencyWidgetConfig } from '../../api/types/mirror';
import { CurrencySearchList } from '../widgets/currency/CurrencySearchList';
import { FormCard } from '../ui/form-card';
import type { WidgetSettingsFormProps } from '../widgets/types';

type CurrencyWidgetFormProps = WidgetSettingsFormProps<CurrencyWidgetConfig>;

export function CurrencyWidgetForm({ initialConfig, onSubmit, onCancel }: CurrencyWidgetFormProps) {
  const [symbol, setSymbol] = useState(initialConfig.symbol);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!symbol.trim()) {
      return;
    }

    onSubmit({
      symbol: symbol.trim(),
    });
  };

  return (
    <FormCard onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-foreground">Currency</p>

      <div className="rounded-md border border-border bg-overlay px-3 py-2">
        <p className="text-[11px] uppercase tracking-wide text-muted">Selected symbol</p>
        <p className="text-sm font-medium text-foreground">{symbol || 'Nothing selected yet'}</p>
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <CurrencySearchList onSelect={setSymbol} autoFocus />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!symbol.trim()}
          className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Spara
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground"
          >
            Avbryt
          </button>
        )}
      </div>
    </FormCard>
  );
}
