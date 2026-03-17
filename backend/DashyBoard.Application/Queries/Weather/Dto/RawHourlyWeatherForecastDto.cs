using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record RawHourlyWeatherForecastDto(
        double Latitude,
        double Longitude,
        RawHourlyForecastData Hourly
    );

    public sealed record RawHourlyForecastData(
        [property: JsonPropertyName("time")] List<string> Time,
        [property: JsonPropertyName("temperature_2m")] List<double> Temperature,
        [property: JsonPropertyName("weather_code")] List<int> WeatherCode,
        [property: JsonPropertyName("wind_speed_10m")] List<double> WindSpeed,
        [property: JsonPropertyName("precipitation")] List<double> Precipitation,
        [property: JsonPropertyName("precipitation_probability")] List<int> PrecipitationProbability
    );
}
