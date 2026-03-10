
using DashyBoard.Application.Queries.Weather.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface IWeatherApiClient
    {
        Task<CurrentWeatherDto> GetCurrentWeatherAsync(string longi, string lati, CancellationToken ct);
        Task<WeatherForecastDto> GetWeatherForecastAsync(string longi, string lati, CancellationToken ct);
    }
}
