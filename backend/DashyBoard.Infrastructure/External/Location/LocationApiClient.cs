using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location.Dto;
using DashyBoard.Infrastructure.External.Location.Models;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External.Location
{
    public sealed class LocationApiClient : ILocationApiClient
    {
        private readonly HttpClient _http;

        public LocationApiClient(HttpClient http) => _http = http;

        public async Task<IReadOnlyList<CountryDto>> GetAllCountriesAsync(CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<List<RestCountry>>(
                "all?fields=name,cca2,flags,flag",
                ct);

            return result?
                .Select(country => new CountryDto(
                    country.Cca2,
                    country.Name.Common,
                    country.Flags.Png,
                    country.Flag))
                .OrderBy(country => country.Name)
                .ToList()
                ?? [];
        }

        public async Task<IReadOnlyList<CountryDto>> GetCountryByNameAsync(string countryName, CancellationToken ct)
        {
            var encodedCountryName = Uri.EscapeDataString(countryName);

            var result = await _http.GetFromJsonAsync<List<RestCountry>>(
                $"name/{encodedCountryName}?fields=name,cca2,flags,flag",
                ct);

            return result?
                .Select(country => new CountryDto(
                    country.Cca2,
                    country.Name.Common,
                    country.Flags.Png,
                    country.Flag))
                .OrderBy(country => country.Name)
                .ToList()
                ?? [];
        }
    }
}
