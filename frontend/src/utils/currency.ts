import type { CurrencyPricePointDto } from '../api/types/currency';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function buildStartDate(daysBack: number): string {
  const date = new Date();
  date.setTime(date.getTime() - daysBack * MS_PER_DAY);
  return date.toISOString().split('T')[0];
}

export function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatAxisPrice(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

export function formatTimestamp(timestamp: number, daysBack: number): string {
  const date = new Date(timestamp * 1000);
  if (daysBack <= 1)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (daysBack <= 7) return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' });
  if (daysBack <= 90) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function formatTooltipDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPriceChange(history: CurrencyPricePointDto[]): {
  value: number;
  percent: number;
} {
  if (history.length < 2) return { value: 0, percent: 0 };
  const first = history[0].close;
  const last = history[history.length - 1].close;
  return {
    value: last - first,
    percent: ((last - first) / first) * 100,
  };
}
