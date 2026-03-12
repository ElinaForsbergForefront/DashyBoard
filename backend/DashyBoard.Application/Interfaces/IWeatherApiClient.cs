
using DashyBoard.Application.Queries.Weather.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface IWeatherApiClient
    {
        Task<RawCurrentWeatherDto> GetCurrentWeatherAsync(string longi, string lati, CancellationToken ct);
        Task<RawWeatherForecastDto> GetWeatherForecastAsync(string longi, string lati, CancellationToken ct);
    }
}
