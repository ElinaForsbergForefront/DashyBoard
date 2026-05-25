export interface EmptyWidgetConfig {
  [key: string]: never;
}

export interface ClockWidgetConfig {
  timezone: string;
}

export interface WeatherWidgetConfig {
  city: string;
}

export interface CurrencyWidgetConfig {
  symbol: string;
}

export interface TrafficWidgetConfig {
  stationName: string;
  transportModes: string[];
}

interface WidgetBase<TType extends string, TConfig> {
  id: string;
  type: TType;
  x: number;
  y: number;
  config: TConfig;
}

export type ClockWidgetDto = WidgetBase<'clock', ClockWidgetConfig>;
export type WeatherWidgetDto = WidgetBase<'weather', WeatherWidgetConfig>;
export type CurrencyWidgetDto = WidgetBase<'currency', CurrencyWidgetConfig>;
export type TrafficWidgetDto = WidgetBase<'traffic', TrafficWidgetConfig>;
export type PassiveWidgetDto = WidgetBase<
  'reminder' | 'spotify' | 'weather-forecast',
  EmptyWidgetConfig
>;

export type MirrorWidgetDto =
  | ClockWidgetDto
  | WeatherWidgetDto
  | CurrencyWidgetDto
  | TrafficWidgetDto
  | PassiveWidgetDto;

export type AnyWidgetConfig = MirrorWidgetDto['config'];

export interface MirrorDto {
  id: string;
  userSub: string;
  name: string;
  widthCm: number;
  heightCm: number;
  createdAt: string;
  widgets: MirrorWidgetDto[];
}

export interface CreateMirrorRequest {
  name: string;
  widthCm: number;
  heightCm: number;
}

export interface UpdateMirrorRequest {
  name: string;
  widthCm: number;
  heightCm: number;
}

export interface AddWidgetRequest {
  type: string;
  x: number;
  y: number;
  config?: Record<string, unknown>;
}

export interface MoveWidgetRequest {
  x: number;
  y: number;
}

export interface UpdateWidgetConfigRequest {
  config: Record<string, unknown>;
}
