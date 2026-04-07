import type { CurrencyPricePointDto } from '../../../api/types/currency';
import { formatPrice, formatTooltipDate } from '../../../utils/currency';

interface CurrencyChartTooltipProps {
  active?: boolean;
  payload?: { payload: CurrencyPricePointDto; value: number }[];
  currency: string;
}

export function CurrencyChartTooltip({ active, payload, currency }: CurrencyChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-elevated px-2.5 py-1.5 shadow-lg space-y-0.5">
      <p className="text-[10px] text-muted">{formatTooltipDate(point.timestamp)}</p>
      <p className="text-xs font-medium text-foreground">{formatPrice(point.close, currency)}</p>
      <div className="flex gap-3 text-[10px] text-muted">
        <span>O {point.open.toFixed(2)}</span>
        <span>H {point.high.toFixed(2)}</span>
        <span>L {point.low.toFixed(2)}</span>
      </div>
    </div>
  );
}
