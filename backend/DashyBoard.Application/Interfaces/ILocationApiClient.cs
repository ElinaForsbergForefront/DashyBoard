using DashyBoard.Application.Queries.Location.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface ILocationApiClient
    {
        Task<IReadOnlyList<CountryDto>> GetAllCountriesAsync(CancellationToken ct);
        Task<IReadOnlyList<CountryDto>> GetCountryByNameAsync(string countryName, CancellationToken ct);
    }
}
