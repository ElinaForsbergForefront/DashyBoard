using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Geocoding.Dto;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Serialization;

namespace DashyBoard.Infrastructure.External;

public sealed class NominatimApiClient : IGeocodingApiClient
{
    private readonly HttpClient _http;
    private const int MaxAddressLength = 500;

    public NominatimApiClient(HttpClient http) => _http = http;

    public async Task<GeocodeResponseDto> GeocodeAddressAsync(string address, CancellationToken ct)
    {
        var sanitizedAddress = ValidateAndSanitizeAddress(address);
        var encodedAddress = WebUtility.UrlEncode(sanitizedAddress);

        var result = await _http.GetFromJsonAsync<List<NominatimResponse>>(
            $"search?format=json&limit=1&q={encodedAddress}", ct);

        if (result == null || result.Count == 0)
            throw new InvalidOperationException($"Address '{address}' could not be geocoded.");

        var location = result[0];
        var (latitude, longitude) = ParseCoordinates(location);

        return new GeocodeResponseDto(latitude, longitude, location.DisplayName ?? sanitizedAddress);
    }

    private static string ValidateAndSanitizeAddress(string address)
    {
        if (string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("Address cannot be empty.", nameof(address));

        var sanitized = SanitizeAddress(address);

        if (string.IsNullOrWhiteSpace(sanitized))
            throw new ArgumentException("Address contains no valid characters.", nameof(address));

        return sanitized;
    }

    private static string SanitizeAddress(string address)
    {
        if (address.Length > MaxAddressLength)
            address = address[..MaxAddressLength];

        var sanitized = address.Trim();

        if (!sanitized.Any(char.IsLetterOrDigit))
            return string.Empty;

        return sanitized;
    }

    private static (double Latitude, double Longitude) ParseCoordinates(NominatimResponse location)
    {
        if (!double.TryParse(location.Lat, NumberStyles.Float, CultureInfo.InvariantCulture, out var latitude) ||
            !double.TryParse(location.Lon, NumberStyles.Float, CultureInfo.InvariantCulture, out var longitude))
        {
            throw new InvalidOperationException("Invalid coordinates received from geocoding service.");
        }

        return (latitude, longitude);
    }

    private sealed class NominatimResponse
    {
        [JsonPropertyName("lat")]
        public string? Lat { get; set; }

        [JsonPropertyName("lon")]
        public string? Lon { get; set; }

        [JsonPropertyName("display_name")]
        public string? DisplayName { get; set; }
    }
}
