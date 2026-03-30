export interface CurrentWeatherDto{
  Latitude: number;
  Longitude: number;
  Current: WeatherData;
}

export interface WeatherData {
  AirTemperature: number;
  ApperentTemperature: number;
  WindSpeed: number;
  WeatherCode: string;
  Precipitation: number;
  PrecipitationProbability: number;
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

