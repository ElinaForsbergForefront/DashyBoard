export interface AssetTickersDto {
  symbol: string | null;
  name: string | null;
}

export interface AssetPriceDto {
  name: string | null;
  symbol: string | null;
  price: number;
  updatedAt: string;
  updatedAtReadable: string | null;
}
