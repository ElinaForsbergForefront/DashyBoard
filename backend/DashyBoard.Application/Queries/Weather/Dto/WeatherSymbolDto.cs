using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record WeatherSymbolDto(
    string CreatedTime,
    List<TimeSeries> TimeSeries
    );

    public sealed record TimeSeries(
    DateTime Time,
    WeatherData Data
    );

    public sealed record WeatherData(
     [property: JsonPropertyName("air_temperature")] double air_temperature,
     [property: JsonPropertyName("wind_speed")] double wind_speed,
     [property: JsonPropertyName("symbol_code")] double symbol_code
    );
}
