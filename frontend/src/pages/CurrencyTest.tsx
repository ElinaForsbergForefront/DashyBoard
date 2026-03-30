import { useState } from 'react';
import { useGetCurrencyChartQuery } from '../api/endpoints/currency';
import { useCurrencySearch } from '../hooks/useCurrencySearch';

export function CurrencyTest() {
  const [selectedSymbol, setSelectedSymbol] = useState('');

  const { query, results, isSearching, handleSearchChange } = useCurrencySearch();

  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
  } = useGetCurrencyChartQuery({ symbol: selectedSymbol }, { skip: !selectedSymbol });

  return (
    <div className="p-6 space-y-8 text-foreground">
      <h1 className="text-2xl font-bold">Currency API Test</h1>

      {/* Search */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Search Currencies</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search e.g. EUR, Bitcoin, Apple..."
          className="w-full max-w-md px-3 py-2 rounded-md bg-input text-foreground border border-border"
        />
        {isSearching && <p className="text-foreground-secondary">Searching...</p>}
        {results.length > 0 && (
          <ul className="space-y-1 max-w-md">
            {results.map((item) => (
              <li
                key={item.symbol}
                onClick={() => setSelectedSymbol(item.symbol)}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer bg-card hover:bg-accent"
              >
                {item.logoUrl && <img src={item.logoUrl} alt="" className="w-6 h-6 rounded" />}
                <div>
                  <span className="font-medium">{item.symbol}</span>
                  <span className="ml-2 text-foreground-secondary">{item.shortName}</span>
                </div>
                <span className="ml-auto text-xs text-foreground-secondary">{item.quoteType}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chart Data */}
      {selectedSymbol && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Chart: <span className="text-primary">{selectedSymbol}</span>
          </h2>
          {isChartLoading && <p className="text-foreground-secondary">Loading chart data...</p>}
          {chartError && <p className="text-destructive">Error loading chart data.</p>}
          {chartData && (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Asset:</span> {chartData.assetName} (
                {chartData.currency})
              </p>
              <p className="text-foreground-secondary">
                {chartData.priceHistory.length} data points
              </p>
              <div className="overflow-auto max-h-64 rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Time</th>
                      <th className="p-2 text-right">Open</th>
                      <th className="p-2 text-right">Close</th>
                      <th className="p-2 text-right">Low</th>
                      <th className="p-2 text-right">High</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.priceHistory.map((point) => (
                      <tr key={point.timestamp} className="border-t border-border-subtle">
                        <td className="p-2">{new Date(point.timestamp * 1000).toLocaleString()}</td>
                        <td className="p-2 text-right">{point.open.toFixed(4)}</td>
                        <td className="p-2 text-right">{point.close.toFixed(4)}</td>
                        <td className="p-2 text-right">{point.low.toFixed(4)}</td>
                        <td className="p-2 text-right">{point.high.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
