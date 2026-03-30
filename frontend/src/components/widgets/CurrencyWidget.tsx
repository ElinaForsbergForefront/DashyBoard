import { useMemo, useState } from 'react';
import type { CurrencyPricePointDto } from '../../api/types/currency';
import { useGetCurrencyChartQuery } from '../../api/endpoints/currency';
import { GlassCard } from '../ui/glass-card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CurrencyDropdown } from './CurrencyDropdown';

const INTERVALS = [
  { label: '1D', value: '30m', daysBack: 1 },
  { label: '5D', value: '1h', daysBack: 5 },
  { label: '1M', value: '1d', daysBack: 30 },
  { label: '3M', value: '5d', daysBack: 90 },
  { label: '1Y', value: '1wk', daysBack: 365 },
] as const;

type IntervalPreset = (typeof INTERVALS)[number];

function buildStartDate(daysBack: number): string {
  const date = new Date();
  date.setTime(date.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
}

function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

function formatAxisPrice(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  if (value >= 1) return value.toFixed(2);
  return value.toFixed(4);
}

function formatTimestamp(timestamp: number, daysBack: number): string {
  const date = new Date(timestamp * 1000);
  if (daysBack <= 1)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (daysBack <= 7) return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' });
  if (daysBack <= 90) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function formatTooltipDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPriceChange(history: CurrencyPricePointDto[]) {
  if (history.length < 2) return { value: 0, percent: 0 };
  const first = history[0].close;
  const last = history[history.length - 1].close;
  return {
    value: last - first,
    percent: ((last - first) / first) * 100,
  };
}

export function CurrencyWidget() {
  const [activePreset, setActivePreset] = useState<IntervalPreset>(INTERVALS[0]);
  const [symbol, setSymbol] = useState('ETH-USD');

  const start = useMemo(() => buildStartDate(activePreset.daysBack), [activePreset]);

  const { data, isLoading, isError } = useGetCurrencyChartQuery({
    symbol,
    interval: activePreset.value,
    start,
  });

  const change = useMemo(
    () => (data ? getPriceChange(data.priceHistory) : { value: 0, percent: 0 }),
    [data],
  );

  const isPositive = change.value >= 0;
  const latestPrice = data?.priceHistory.at(-1)?.close;
  const accentColor = isPositive ? 'var(--color-success)' : 'var(--color-destructive)';

  return (
    <GlassCard className="glass-widget w-80">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <CurrencyDropdown
            currentSymbol={symbol}
            currentName={data?.assetName}
            onSelect={setSymbol}
          />
          {data && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                color: accentColor,
                backgroundColor: isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(220,40,40,0.12)',
              }}
            >
              {isPositive ? '+' : ''}
              {change.percent.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Price */}
        {latestPrice != null && data && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              {formatPrice(latestPrice, data.currency)}
            </span>
            <span className="text-xs" style={{ color: accentColor }}>
              {isPositive ? '▲' : '▼'} {Math.abs(change.value).toFixed(4)}
            </span>
          </div>
        )}

        {/* Chart area */}
        <div className="h-36 w-full">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-muted">Failed to load chart data.</p>
            </div>
          )}
          {data && data.priceHistory.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.priceHistory} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(ts: number) => formatTimestamp(ts, activePreset.daysBack)}
                  tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />
                <YAxis
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={formatAxisPrice}
                  tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  content={<ChartTooltip currency={data.currency} />}
                  cursor={{ stroke: 'var(--color-border)', strokeDasharray: '3 3' }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={accentColor}
                  strokeWidth={2}
                  fill="url(#priceFill)"
                  dot={false}
                  activeDot={{ r: 3, fill: accentColor, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Interval selector */}
        <div className="flex gap-1">
          {INTERVALS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`flex-1 rounded-lg py-1 text-xs font-medium transition
                ${
                  activePreset.label === preset.label
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted hover:bg-overlay hover:text-foreground-secondary'
                }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: { payload: CurrencyPricePointDto; value: number }[];
  currency: string;
}) {
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
