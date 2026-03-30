import { api } from '../apiSlice';
import type { CurrentWeatherDto, DailyWeatherForecastDto, HourlyWeatherforecastDto} from '../types/weather';

type WeatherArg = {
  longi: string;
  lati: string;
};

const weatherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<CurrentWeatherDto, WeatherArg>({
      query: ({ longi, lati }) => `CurrentWeather/${longi}/${lati}`,
      providesTags: (_result, _error, { longi, lati }) => [{ type: 'Weather', id: `${longi}-${lati}` }]
    }),
    getDailyWeather: builder.query<DailyWeatherForecastDto, WeatherArg>({
      query: ({ longi, lati }) => `DailyWeatherForecast/${longi}/${lati}`,
      providesTags: (_result, _error, { longi, lati }) => [{ type: 'Weather', id: `${longi}-${lati}` }]
    }),
    getHourlyWeather: builder.query<HourlyWeatherforecastDto, WeatherArg>({
      query: ({ longi, lati }) => `HourlyWeatherForecast/${longi}/${lati}`,
      providesTags: (_result, _error, { longi, lati }) => [{ type: 'Weather', id: `${longi}-${lati}` }]
    }),
  }),
});



export const { useGetCurrentWeatherQuery, useGetDailyWeatherQuery, useGetHourlyWeatherQuery } = weatherApi;