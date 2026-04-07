using DashyBoard.Application.Queries.Location.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface ICityApiClient
    {
        Task<IReadOnlyList<CityDto>> GetCitiesByNameAsync(string cityName, string countryCode, CancellationToken ct);
    }
}
