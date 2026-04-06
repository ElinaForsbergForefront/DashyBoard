export interface CurrentWeatherDto{
  latitude: number;
  longitude: number;
  current: WeatherData;
}

export interface WeatherData {
  temperature_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
  weather_code: string;
  precipitation: number;
  precipitation_probability: number;
}

export interface DailyWeatherForecastDto{
  Latitude: number;
  Longitude: number;
  daily: DailyforecastData;
}

export interface DailyforecastData {
  Time: string[];
  WeatherType: string[];
  temperature_2m_max: number[];
  temperature_2n_min: number[]
}

export interface HourlyWeatherforecastDto {
  Latitude: number;
  Longitude: number;
  Hourly: HourlyForecastData; 
}

export interface HourlyForecastData {
  Time: string[];
  Temperature: number[];
  WeatherCode: string[];
  WindSpeed: number[];
  Precipitation: number[];
  PrecipitationProbability: number[];
}

