using System.Text.Json.Serialization;
using DashyBoard.Domain.Models;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record CurrentWeatherDto(
    double Latitude,
    double Longitude,
    WeatherData Current
    );

    public sealed record WeatherData(
     [property: JsonPropertyName("temperature_2m")] double AirTemperature,
     [property: JsonPropertyName("apparent_temperature")] double ApperentTemperature,
     [property: JsonPropertyName("wind_speed")] double WindSpeed,
     [property: JsonPropertyName("weather_code")] WeatherType WeatherCode,
     [property: JsonPropertyName("precipitation")] double Precipitation,
     [property: JsonPropertyName("precipitation_probability")] double PrecipitationProbability
    );
}
