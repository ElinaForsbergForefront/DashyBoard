
using DashyBoard.Application.Queries.Weather.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface IWeatherApiClient
    {
        Task<WeatherSymbolDto> GetWeatherSymbolAsync(string longi, string lati, CancellationToken ct);
    }
}
