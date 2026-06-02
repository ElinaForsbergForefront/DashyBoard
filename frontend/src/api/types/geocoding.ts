export interface GeocodeResponseDto {
  longitude: number;
  latitude: number;
  address?: string | null;
  formattedAddress?: string | null;
}
