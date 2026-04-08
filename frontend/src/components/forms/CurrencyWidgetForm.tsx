import { CurrencySearchList } from '../widgets/currency/CurrencySearchList';

interface CurrencyWidgetFormProps {
  onSuccess?: () => void;
}

export function CurrencyWidgetForm({ onSuccess }: CurrencyWidgetFormProps = {}) {
  const handleSelect = (symbol: string) => {
    // TODO: persist selected symbol to widget config/state
    console.log('Selected currency symbol:', symbol);
    onSuccess?.();
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-3 space-y-3">
      <p className="text-sm font-medium text-foreground">Search symbol</p>
      <CurrencySearchList onSelect={handleSelect} autoFocus />
    </div>
  );
}
