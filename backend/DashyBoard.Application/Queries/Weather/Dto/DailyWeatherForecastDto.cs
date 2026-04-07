using DashyBoard.Domain.Models;
using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record DailyWeatherForecastDto(
        double Latitude,
        double Longitude,
        DailyForecastData Daily
    );

    public sealed record DailyForecastData(
        [property: JsonPropertyName("time")] List<string> Time,
        [property: JsonPropertyName("weather_code")] List<WeatherType> WeatherCode,
        [property: JsonPropertyName("temperature_2m_max")] List<double> TemperatureMax,
        [property: JsonPropertyName("temperature_2m_min")] List<double> TemperatureMin
    );
}
