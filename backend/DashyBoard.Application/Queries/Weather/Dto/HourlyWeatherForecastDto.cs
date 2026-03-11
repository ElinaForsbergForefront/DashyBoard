using System.Text.Json.Serialization;
using DashyBoard.Domain.Models;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record HourlyWeatherForecastDto(
        double Latitude,
        double Longitude,
        HourlyForecastData Hourly
    );

    public sealed record HourlyForecastData(
        [property: JsonPropertyName("time")] List<string> Time,
        [property: JsonPropertyName("temperature_2m")] List<double> Temperature,
        [property: JsonPropertyName("weather_code")] List<WeatherType> WeatherCode,
        [property: JsonPropertyName("wind_speed_10m")] List<double> WindSpeed,
        [property: JsonPropertyName("precipitation")] List<double> Precipitation,
        [property: JsonPropertyName("precipitation_probability")] List<int> PrecipitationProbability
    );
}
