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
}