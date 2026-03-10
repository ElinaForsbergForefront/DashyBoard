using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace DashyBoard.Infrastructure.External;

public sealed class TrafficApiClient : ITrafficApiClient
{
    private readonly HttpClient _http;
    private readonly string _apiKey;

    public TrafficApiClient(HttpClient http, IConfiguration configuration)
    {
        _http = http;
        _apiKey = configuration["TrafficApi:ApiKey"]!;
    }


/*
    public async Task<IReadOnlyList<StationDto>> GetAllStopsAsync(CancellationToken ct = default)
    {
        var doc = await _http.GetFromJsonAsync<JsonDocument>($"stops/list?key={_apiKey}", ct);
        return doc?.RootElement
            .GetProperty("stop_groups")
            .EnumerateArray()
            .SelectMany(g =>
            {
                var modes = g.GetProperty("transport_modes")
                    .EnumerateArray()
                    .Select(m => m.GetString()!)
                    .ToList();

                return g.GetProperty("stops")
                    .EnumerateArray()
                    .Select(s => new StationDto(
                        s.GetProperty("id").GetString()!,
                        s.GetProperty("name").GetString()!,
                        s.GetProperty("lat").GetDouble(),
                        s.GetProperty("lon").GetDouble(),
                        modes
                    ));
            })
            .ToList() ?? [];
    }  */

    public async Task<IReadOnlyList<StationDto>> GetStopByNameAsync(string name, CancellationToken ct = default)
    {
        var doc = await _http.GetFromJsonAsync<JsonDocument>($"stops/name/{name}?key={_apiKey}", ct);
        return doc?.RootElement
            .GetProperty("stop_groups")
            .EnumerateArray()
            .SelectMany(g =>
            {
                var groupId = g.GetProperty("id").GetString()
                    ?? throw new InvalidOperationException("Stop group is missing an id");  
                var groupName = g.GetProperty("name").GetString()
                    ?? throw new InvalidOperationException("Stop group is missing a name");
                var modes = g.GetProperty("transport_modes")
                    .EnumerateArray()
                    .Select(m => m.GetString()!)
                    .ToList();

                return g.GetProperty("stops")
                    .EnumerateArray()
                    .Select(s => new StationDto(
                        groupId,
                        groupName,
                        s.GetProperty("id").GetString()!,
                        s.GetProperty("name").GetString()!,
                        s.GetProperty("lat").GetDouble(),
                        s.GetProperty("lon").GetDouble(),
                        modes
                    ));
            })
            .ToList() ?? [];
    }

    public async Task<IReadOnlyList<DepartureDto>> GetDeparturesAsync(string siteId, CancellationToken ct = default)
    {
        var doc = await _http.GetFromJsonAsync<JsonDocument>($"departures/{siteId}?key={_apiKey}", ct);
        return doc?.RootElement
            .GetProperty("departures")
            .EnumerateArray()
            .Select(d =>
            {
                var route = d.GetProperty("route");
                var platform = d.GetProperty("realtime_platform");

                return new DepartureDto(
                    d.GetProperty("scheduled").GetDateTime(),
                    d.TryGetProperty("realtime", out var rt) ? rt.GetDateTime() : null,
                    d.GetProperty("delay").GetInt32(),
                    d.GetProperty("canceled").GetBoolean(),
                    route.GetProperty("designation").GetString()!,
                    route.GetProperty("direction").GetString()!,
                    route.GetProperty("transport_mode").GetString()!,
                    platform.GetProperty("designation").GetString()!
                );
            })
            .ToList() ?? [];
    }


    public async Task<IReadOnlyList<DepartureDto>> GetDeparturesSpecificTimeAsync(string siteId, string dateTime, CancellationToken ct = default)
    {
        var doc = await _http.GetFromJsonAsync<JsonDocument>($"departures/{siteId}?key={_apiKey}", ct);
        return doc?.RootElement
            .GetProperty("departures")
            .EnumerateArray()
            .Select(d =>
            {
                var route = d.GetProperty("route");
                var platform = d.GetProperty("realtime_platform");

                return new DepartureDto(
                    d.GetProperty("scheduled").GetDateTime(),
                    d.TryGetProperty("realtime", out var rt) ? rt.GetDateTime() : null,
                    d.GetProperty("delay").GetInt32(),
                    d.GetProperty("canceled").GetBoolean(),
                    route.GetProperty("designation").GetString()!,
                    route.GetProperty("direction").GetString()!,
                    route.GetProperty("transport_mode").GetString()!,
                    platform.GetProperty("designation").GetString()!
                );
            })
            .ToList() ?? [];
    }




    public async Task<IReadOnlyList<ArrivalDto>> GetArrivalsAsync(string siteId, CancellationToken ct = default)
    {
        var doc = await _http.GetFromJsonAsync<JsonDocument>($"arrivals/{siteId}?key={_apiKey}", ct);
        return doc?.RootElement
            .GetProperty("arrivals")
            .EnumerateArray()
            .Select(d =>
            {
                var route = d.GetProperty("route");
                var platform = d.GetProperty("realtime_platform");

                return new ArrivalDto(
                    d.GetProperty("scheduled").GetDateTime(),
                    d.TryGetProperty("realtime", out var rt) ? rt.GetDateTime() : null,
                    d.GetProperty("delay").GetInt32(),
                    d.GetProperty("canceled").GetBoolean(),
                    route.GetProperty("designation").GetString()!,
                    route.GetProperty("direction").GetString()!,
                    route.GetProperty("transport_mode").GetString()!,
                    platform.GetProperty("designation").GetString()!
                );
            })
            .ToList() ?? [];
    }


    public async Task<IReadOnlyList<ArrivalDto>> GetArrivalsSpecificTimeAsync(string siteId, string dateTime, CancellationToken ct = default)
    {
        var doc = await _http.GetFromJsonAsync<JsonDocument>($"arrivals/{siteId}?key={_apiKey}", ct);
        return doc?.RootElement
            .GetProperty("arrivals")
            .EnumerateArray()
            .Select(d =>
            {
                var route = d.GetProperty("route");
                var platform = d.GetProperty("realtime_platform");

                return new ArrivalDto(
                    d.GetProperty("scheduled").GetDateTime(),
                    d.TryGetProperty("realtime", out var rt) ? rt.GetDateTime() : null,
                    d.GetProperty("delay").GetInt32(),
                    d.GetProperty("canceled").GetBoolean(),
                    route.GetProperty("designation").GetString()!,
                    route.GetProperty("direction").GetString()!,
                    route.GetProperty("transport_mode").GetString()!,
                    platform.GetProperty("designation").GetString()!
                );
            })
            .ToList() ?? [];
    }


}