using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Weather.Dto;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External
{
    public sealed class WeatherApiClient : IWeatherApiClient
    {
        private readonly HttpClient _http;
        public WeatherApiClient(HttpClient http) => _http = http;


        public async Task<WeatherSymbolDto>GetWeatherSymbolAsync(string longi, string lati, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<WeatherSymbolDto>($"geotype/point/lon/{longi}/lat/{lati}/data.json?timeseries=1", ct);
            return result ?? throw new InvalidOperationException("Empty response from Weather API.");
        }
    }
}
