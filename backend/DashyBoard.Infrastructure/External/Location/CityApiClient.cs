using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location.Dto;
using DashyBoard.Infrastructure.External.Location.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External.Location
{
    public sealed class CityApiClient : ICityApiClient
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;

        public CityApiClient(HttpClient http, IConfiguration configuration)
        {
            _http = http;
            _apiKey = configuration["Geoapify:ApiKey"]
                ?? throw new InvalidOperationException("Geoapify:ApiKey saknas.");
        }

        public async Task<IReadOnlyList<CityDto>> GetCitiesByNameAsync(
            string cityName,
            string countryCode,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(cityName) || string.IsNullOrWhiteSpace(countryCode))
            {
                return [];
            }

            var encodedCity = Uri.EscapeDataString(cityName.Trim());
            var encodedCountry = Uri.EscapeDataString(countryCode.Trim().ToLowerInvariant());
            var encodedApiKey = Uri.EscapeDataString(_apiKey);

            var url =
                $"geocode/autocomplete" +
                $"?text={encodedCity}" +
                $"&type=city" +
                $"&filter=countrycode:{encodedCountry}" +
                $"&limit=10" +
                $"&format=json" +
                $"&apiKey={encodedApiKey}";

            var result = await _http.GetFromJsonAsync<GeoapifyAutocompleteResponse>(url, ct);

            return result?.Results?
                .Where(x => !string.IsNullOrWhiteSpace(x.City))
                .Where(x =>
                    string.Equals(x.ResultType, "city", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(x.ResultType, "postcode", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(x.ResultType, "suburb", StringComparison.OrdinalIgnoreCase)
                )
                .Select(x => new CityDto(
                    x.City!,
                    x.Country ?? string.Empty))
                .DistinctBy(x => $"{x.Name}|{x.Country}")
                .OrderBy(x => x.Name)
                .ToList()
                ?? [];
        }
    }
}
