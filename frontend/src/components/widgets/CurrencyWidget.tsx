import { useMemo, useState } from 'react';
import { useGetCurrencyChartQuery } from '../../api/endpoints/currency';
import { GlassCard } from '../ui/glass-card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CurrencyDropdown } from './currency/CurrencyDropdown';
import { CurrencyChartTooltip } from './currency/CurrencyChartTooltip';
import { INTERVALS, type IntervalPreset } from '../constants/currency';
import {
  buildStartDate,
  formatPrice,
  formatAxisPrice,
  formatTimestamp,
  getPriceChange,
} from '../../utils/currency';

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
    <GlassCard className="glass-widget w-full h-full">
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
                  width={48}
                />
                <Tooltip
                  content={<CurrencyChartTooltip currency={data.currency} />}
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

        <div className="flex gap-1">
          {INTERVALS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setActivePreset(preset)}
              className={`cursor-pointer flex-1 rounded-lg py-1 text-xs font-medium transition
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
