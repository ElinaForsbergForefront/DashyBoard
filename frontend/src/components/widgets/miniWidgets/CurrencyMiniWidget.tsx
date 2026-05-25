import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';
import { useGetCurrencyChartQuery } from '../../../api/endpoints/currency';
import { GlassCard } from '../../ui/glass-card';
import { useEditModeContext } from '../../../context/EditModeContext';
import { INTERVALS } from '../../constants/currency';
import { buildStartDate, formatPrice, getPriceChange } from '../../../utils/currency';
import { CurrencySearchList } from '../currency/CurrencySearchList';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import type { WidgetViewProps } from '../types';
import type { CurrencyWidgetDto } from '../../../api/types/mirror';

export function CurrencyMiniWidget({ widget, onUpdateConfig }: WidgetViewProps<CurrencyWidgetDto>) {
  const [symbol, setSymbol] = useState(widget.config.symbol || 'ETH-USD');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isEditMode } = useEditModeContext();
  const activePreset = INTERVALS[0];
  const start = useMemo(() => buildStartDate(activePreset.daysBack), [activePreset.daysBack]);

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
    <>
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col h-full gap-1">
          {/* Top: info row */}
          <div className="flex items-start justify-between gap-2 shrink-0">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-medium text-muted uppercase tracking-wide leading-none">
                  {symbol.split('-')[0]}
                </p>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="shrink-0 rounded p-0.5 text-muted hover:text-foreground transition-colors"
                    aria-label="Change asset"
                  >
                    <Pencil size={11} />
                  </button>
                )}
              </div>
              {!isLoading && !isError && latestPrice != null && data && (
                <span className="text-base font-semibold tracking-tight text-foreground leading-none">
                  {formatPrice(latestPrice, data.currency)}
                </span>
              )}
              {isLoading && <p className="text-xs text-muted">…</p>}
              {isError && <p className="text-[10px] text-muted">Fel</p>}
            </div>
            {!isLoading && !isError && data && (
              <span
                className="text-[10px] font-medium rounded-full px-1.5 py-0.5 shrink-0"
                style={{
                  color: accentColor,
                  backgroundColor: isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(220,40,40,0.12)',
                }}
              >
                {isPositive ? '+' : ''}{change.percent.toFixed(2)}%
              </span>
            )}
          </div>

          {/* Bottom: chart */}
          {data && data.priceHistory.length > 0 && (
            <div className="h-16 w-full shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.priceHistory} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="miniPriceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={accentColor}
                    strokeWidth={1.5}
                    fill="url(#miniPriceFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </GlassCard>
      {isEditModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <GlassCard
              className="glass-form w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Change asset</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Close
                </button>
              </div>
              <CurrencySearchList
                autoFocus
                onSelect={(newSymbol) => {
                  setSymbol(newSymbol);
                  onUpdateConfig?.({ symbol: newSymbol });
                  setIsEditModalOpen(false);
                }}
              />
            </GlassCard>
          </div>,
          document.body,
        )}
    </>
  );
}
