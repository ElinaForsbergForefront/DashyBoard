import type {
  AnyWidgetConfig,
  ClockWidgetConfig,
  ClockWidgetDto,
  CurrencyWidgetConfig,
  CurrencyWidgetDto,
  MirrorWidgetDto,
  TrafficWidgetConfig,
  TrafficWidgetDto,
  WeatherWidgetConfig,
  WeatherWidgetDto,
} from '../api/types/mirror';

export function updateMirrorWidgetConfigDraft(
  widget: MirrorWidgetDto,
  config: AnyWidgetConfig,
): MirrorWidgetDto {
  switch (widget.type) {
    case 'clock':
      return {
        ...widget,
        config: config as ClockWidgetConfig,
      } satisfies ClockWidgetDto;

    case 'weather':
      return {
        ...widget,
        config: config as WeatherWidgetConfig,
      } satisfies WeatherWidgetDto;

    case 'currency':
      return {
        ...widget,
        config: config as CurrencyWidgetConfig,
      } satisfies CurrencyWidgetDto;

    case 'traffic':
      return {
        ...widget,
        config: config as TrafficWidgetConfig,
      } satisfies TrafficWidgetDto;

    case 'reminder':
    case 'spotify':
    case 'weather-forecast':
      return widget;

    default:
      return widget;
  }
}
