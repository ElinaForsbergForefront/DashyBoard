using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.WorldTime.Dto;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External;

/// <summary>
/// Hämtar aktuell tid från TimeAPI.io baserat på tidszon:
/// Tidszon i formatet Continent/Stad; Exempel: Europe/Stockholm; 
/// sammansatta stadsnamn med understrek, ex: America/New_York 
/// OBS! Det är inte vilken stad som helst utan bara de som bestämmer tidszoner
/// </summary>
public sealed class WorldTimeApiClient : IWorldTimeApiClient
{
    private readonly HttpClient _http;

    public WorldTimeApiClient(HttpClient http) => _http = http;

    public async Task<WorldTimeDto> GetTimeByTimezoneAsync(string timezone, CancellationToken ct)
    {
        var result = await _http.GetFromJsonAsync<WorldTimeDto>(
            $"api/Time/current/zone?timeZone={timezone}", ct);
        
        return result ?? throw new InvalidOperationException($"Could not fetch time for timezone: {timezone}");
    }

	//public async Task<IReadOnlyList<TimezoneDto>> GetAllTimezonesAsync(CancellationToken ct)
	//{
	//	var result = await _http.GetFromJsonAsync<List<string>>(
	//		"api/TimeZone/AvailableTimeZones", ct);

	//	if (result is null)
	//		throw new InvalidOperationException("Could not fetch timezones");

	//	return result.Select(tz => new TimezoneDto(tz)).ToList();
	//}

	public async Task<IReadOnlyList<TimezoneDto>> GetAllTimezonesAsync(CancellationToken ct)
    {
        var result = await _http.GetFromJsonAsync<List<string>>(
            "api/TimeZone/AvailableTimeZones", ct);
        
        if (result is null)
            throw new InvalidOperationException("Could not fetch timezones");

        var validPrefixes = new[] 
        { 
            "Africa/", "America/", "Antarctica/", "Arctic/", 
            "Asia/", "Atlantic/", "Australia/", "Europe/", 
            "Indian/", "Pacific/" 
        };

        return result
            .Where(tz => validPrefixes.Any(prefix => tz.StartsWith(prefix)))
            .Select(tz => new TimezoneDto(tz))
            .ToList();
    }
}