namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record WeatherSymbolDto(
     string createdTime,
     string air_temperature,
     string wind_speed,
     string symbol_code
    );
}
