using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record RawCurrentWeatherDto(
        double Latitude,
        double Longitude,
        RawWeatherData Current
    );

    public sealed record RawWeatherData(
        [property: JsonPropertyName("temperature_2m")] double AirTemperature,
        [property: JsonPropertyName("apparent_temperature")] double ApperentTemperature,
        [property: JsonPropertyName("wind_speed_10m")] double WindSpeed,
        [property: JsonPropertyName("weather_code")] int WeatherCode,
        [property: JsonPropertyName("precipitation")] double Precipitation,
        [property: JsonPropertyName("precipitation_probability")] double PrecipitationProbability
    );
}
