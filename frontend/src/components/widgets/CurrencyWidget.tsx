import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CurrencyWidgetDto } from '../../api/types/mirror';
import { useGetCurrencyChartQuery } from '../../api/endpoints/currency';
import { GlassCard } from '../ui/glass-card';
import { CurrencyWidgetForm } from '../forms/CurrencyWidgetForm';
import { CurrencyChartTooltip } from './currency/CurrencyChartTooltip';
import {
  buildStartDate,
  formatAxisPrice,
  formatPrice,
  formatTimestamp,
  getPriceChange,
} from '../../utils/currency';
import type { WidgetViewProps } from './types';

export function CurrencyWidget({
  widget,
  isEditMode = false,
  onUpdateConfig,
  onEditingStateChange,
}: WidgetViewProps<CurrencyWidgetDto>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const symbol = widget.config.symbol?.trim() ?? '';
  const start = useMemo(() => buildStartDate(1), []);

  useEffect(() => {
    onEditingStateChange?.(widget.id, isEditModalOpen);
  }, [isEditModalOpen, onEditingStateChange, widget.id]);

  const { data, isLoading, isError } = useGetCurrencyChartQuery(
    {
      symbol,
      interval: '30m',
      start,
    },
    { skip: !symbol },
  );

  const change = useMemo(
    () => (data ? getPriceChange(data.priceHistory) : { value: 0, percent: 0 }),
    [data],
  );

  const isPositive = change.value >= 0;
  const latestPrice = data?.priceHistory.at(-1)?.close;
  const accentColor = isPositive ? 'var(--color-success)' : 'var(--color-destructive)';

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="text-left">
              <h3 className="text-sm font-medium text-foreground-secondary">
                {(data?.assetName ?? symbol) || 'Currency'}
              </h3>
              <p className="text-xs text-muted">{symbol || 'No symbol selected'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
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
              {isEditMode && onUpdateConfig && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
                >
                  Edit
                </button>
              )}
            </div>
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
            {!symbol && (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-muted">No symbol selected yet.</p>
              </div>
            )}
            {isLoading && (
              <div className="flex h-full items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
            {symbol && isError && (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-muted">Failed to load chart data.</p>
              </div>
            )}
            {symbol && data && data.priceHistory.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.priceHistory}
                  margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(ts: number) => formatTimestamp(ts, 1)}
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
        </div>
      </GlassCard>

      {isEditModalOpen &&
        onUpdateConfig &&
        createPortal(
          <div
            className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <GlassCard
              className="glass-form w-full max-w-md"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Edit currency</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <CurrencyWidgetForm
                initialConfig={widget.config}
                onSubmit={(config) => {
                  onUpdateConfig(config);
                  setIsEditModalOpen(false);
                }}
                onCancel={() => setIsEditModalOpen(false)}
              />
            </GlassCard>
          </div>,
          document.body,
        )}
    </>
  );
}
