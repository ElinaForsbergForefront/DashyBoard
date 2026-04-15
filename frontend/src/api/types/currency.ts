export interface CurrencyPricePointDto {
  timestamp: number;
  open: number;
  close: number;
  low: number;
  high: number;
}

export interface CurrencyChartDataDto {
  symbol: string;
  currency: string;
  assetName: string;
  priceHistory: CurrencyPricePointDto[];
}

export interface CurrencySearchQuoteDto {
  symbol: string;
  shortName: string;
  quoteType: string;
  exchange: string | null;
  logoUrl: string | null;
}

export interface CurrencySearchDto {
  count: number;
  quotes: CurrencySearchQuoteDto[];
}

export interface GetCurrencyChartParams {
  symbol: string;
  start?: string;
  end?: string;
  interval?: string;
}
