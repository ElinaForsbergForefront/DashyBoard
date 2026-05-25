import type {
  ClockWidgetDto,
  CurrencyWidgetDto,
  MirrorWidgetDto,
  TrafficWidgetDto,
  WeatherWidgetDto,
} from '../api/types/mirror';
import { getDefaultWidgetConfig } from '../components/widgets/widgetRegistry';

export function createMirrorWidgetDraft(
  id: string,
  type: string,
  x: number,
  y: number,
): MirrorWidgetDto {
  switch (type) {
    case 'clock':
      return {
        id,
        type,
        x,
        y,
        config: getDefaultWidgetConfig(type) as ClockWidgetDto['config'],
      };
    case 'weather':
      return {
        id,
        type,
        x,
        y,
        config: getDefaultWidgetConfig(type) as WeatherWidgetDto['config'],
      };
    case 'currency':
      return {
        id,
        type,
        x,
        y,
        config: getDefaultWidgetConfig(type) as CurrencyWidgetDto['config'],
      };
    case 'traffic':
      return {
        id,
        type,
        x,
        y,
        config: getDefaultWidgetConfig(type) as TrafficWidgetDto['config'],
      };
    case 'reminder':
    case 'spotify':
    case 'weather-forecast':
      return {
        id,
        type,
        x,
        y,
        config: {},
      };
    default:
      throw new Error(`Unsupported widget type: ${type}`);
  }
}
