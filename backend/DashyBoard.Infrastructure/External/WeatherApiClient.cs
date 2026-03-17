using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Weather.Dto;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External
{
    public sealed class WeatherApiClient : IWeatherApiClient
    {

        private readonly HttpClient _http;
        public WeatherApiClient(HttpClient http) => _http = http;


        public async Task<RawCurrentWeatherDto> GetCurrentWeatherAsync(string longi, string lati, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<RawCurrentWeatherDto>($"forecast?latitude={lati}&longitude={longi}&current=temperature_2m,weather_code,precipitation,wind_speed_10m,precipitation_probability,apparent_temperature", ct);
            return result ?? throw new InvalidOperationException("Empty response from Weather API.");
        }

        public async Task<RawHourlyWeatherForecastDto> GetHourlyWeatherForecastAsync(string longi, string lati, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<RawHourlyWeatherForecastDto>($"forecast?latitude={lati}&longitude={longi}&hourly=temperature_2m,weather_code,wind_speed_10m,precipitation,precipitation_probability&timezone=auto", ct);
            return result ?? throw new InvalidOperationException("Empty response from Weather API.");
        }

        public async Task<RawDailyWeatherForecastDto> GetDailyWeatherForecastAsync(string longi, string lati, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<RawDailyWeatherForecastDto>($"forecast?latitude={lati}&longitude={longi}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto", ct);
            return result ?? throw new InvalidOperationException("Empty response from Weather API.");
        }
    }
}
