export const INTERVALS = [
  { label: '1D', value: '30m', daysBack: 1 },
  { label: '5D', value: '1h', daysBack: 5 },
  { label: '1M', value: '1d', daysBack: 30 },
  { label: '3M', value: '5d', daysBack: 90 },
  { label: '1Y', value: '1wk', daysBack: 365 },
] as const;

export type IntervalPreset = (typeof INTERVALS)[number];

export const PRESET_SYMBOLS = [
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'EURUSD=X', name: 'EUR/USD' },
  { symbol: 'GBPUSD=X', name: 'GBP/USD' },
] as const;
