using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Weather.Dto
{
  public sealed record RawCurrentWeatherDto(
      double latitude,
      double longitude,
      RawWeatherData current
  );

  public sealed record RawWeatherData(
      [property: JsonPropertyName("temperature_2m")] double air_temperature,
      [property: JsonPropertyName("wind_speed")] double wind_speed,
      [property: JsonPropertyName("weather_code")] int weather_code,
      [property: JsonPropertyName("precipitation")] double precipitation,
      [property: JsonPropertyName("precipitation_probability")] double precipitation_probability
  );

  public sealed record RawWeatherForecastDto(
      double latitude,
      double longitude,
      RawForecast hourly
  );

  public sealed record RawForecast(
      [property: JsonPropertyName("time")] List<string> Time,
      [property: JsonPropertyName("temperature_2m")] List<double> Temperature,
      [property: JsonPropertyName("weather_code")] List<int> WeatherCode,
      [property: JsonPropertyName("wind_speed_10m")] List<double> WindSpeed,
      [property: JsonPropertyName("precipitation")] List<double> Precipitation,
      [property: JsonPropertyName("precipitation_probability")] List<int> PrecipitationProbability
  );
}
