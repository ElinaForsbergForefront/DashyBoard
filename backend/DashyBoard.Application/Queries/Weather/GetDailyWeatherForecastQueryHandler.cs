using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetDailyWeatherForecastQueryHandler : IRequestHandler<GetDailyWeatherForecastQuery, DailyWeatherForecastDto>
    {
        private readonly IWeatherApiClient _weatherClient;
        private readonly IMemoryCache _cache;

        public GetDailyWeatherForecastQueryHandler(IWeatherApiClient weatherClient, IMemoryCache cache)
        {
            _weatherClient = weatherClient;
            _cache = cache;
        }

        public async Task<DailyWeatherForecastDto> Handle(GetDailyWeatherForecastQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"daily-weather:{request.longi}:{request.lati}";
            if (_cache.TryGetValue(cacheKey, out DailyWeatherForecastDto? cached) && cached is not null)
            {
                return cached;
            }

            var raw = await _weatherClient.GetDailyWeatherForecastAsync(request.longi, request.lati, cancellationToken);
            var result = new DailyWeatherForecastDto(
                raw.Latitude,
                raw.Longitude,
                new DailyForecastData(
                    raw.Daily.Time,
                    raw.Daily.WeatherCode.Select(WeatherCodeMapper.ToWeatherType).ToList(),
                    raw.Daily.TemperatureMax,
                    raw.Daily.TemperatureMin
                )
            );
            _cache.Set(cacheKey, result, TimeSpan.FromHours(12));
            return result;
        }
    }
}
