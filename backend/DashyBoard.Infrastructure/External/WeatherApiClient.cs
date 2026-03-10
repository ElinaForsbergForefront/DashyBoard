using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Weather.Dto;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External
{
    public sealed class WeatherApiClient : IWeatherApiClient
    {
        
        private readonly HttpClient _http;
        public WeatherApiClient(HttpClient http) => _http = http;


        public async Task<CurrentWeatherDto>GetCurrentWeatherAsync(string longi, string lati, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<CurrentWeatherDto>($"forecast?latitude={lati}&longitude={longi}&current=temperature_2m,weather_code,precipitation,wind_speed_10m,precipitation_probability", ct);
            return result ?? throw new InvalidOperationException("Empty response from Weather API.");
        }

        public async Task<WeatherForecastDto> GetWeatherForecastAsync(string longi, string lati, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<WeatherForecastDto>($"forecast?latitude={lati}&longitude={longi}&hourly=temperature_2m,weather_code,wind_speed_10m,precipitation,precipitation_probability&timezone=auto", ct);
            return result ?? throw new InvalidOperationException("Empty response from Weather API.");
        }
    }
}
