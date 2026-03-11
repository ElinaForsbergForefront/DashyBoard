using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record RawDailyWeatherForecastDto(
        double Latitude,
        double Longitude,
        RawDailyForecastDataDto Daily
    );

    public sealed record RawDailyForecastDataDto(
        [property: JsonPropertyName("time")] List<string> Time,
        [property: JsonPropertyName("weather_code")] List<int> WeatherCode,
        [property: JsonPropertyName("temperature_2m_max")] List<double> TemperatureMax,
        [property: JsonPropertyName("temperature_2m_min")] List<double> TemperatureMin
    );
    

    
}
