using System.Text.Json.Serialization;
using DashyBoard.Domain.Models;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record CurrentWeatherDto(
    double latitude,
    double longitude,
    WeatherData current
    );

    public sealed record WeatherData(
     [property: JsonPropertyName("temperature_2m")] double air_temperature,
     [property: JsonPropertyName("wind_speed")] double wind_speed,
     [property: JsonPropertyName("weather_code")] WeatherType weather_code,
     [property: JsonPropertyName("precipitation")] double precipitation,
     [property: JsonPropertyName("precipitation_probability")] double precipitation_probability
    );
}
