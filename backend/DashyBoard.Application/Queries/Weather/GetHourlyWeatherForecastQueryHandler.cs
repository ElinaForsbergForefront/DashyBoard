using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetHourlyWeatherForecastQueryHandler : IRequestHandler<GetHourlyWeatherForecastQuery, HourlyWeatherForecastDto>
    {
        private readonly IWeatherApiClient _weatherClient;
        private readonly IMemoryCache _cache;

        public GetHourlyWeatherForecastQueryHandler(IWeatherApiClient weatherClient, IMemoryCache cache)
        {
            _weatherClient = weatherClient;
            _cache = cache;
        }

        public async Task<HourlyWeatherForecastDto> Handle(GetHourlyWeatherForecastQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"hourly-weather:{request.longi}:{request.lati}";
            if (_cache.TryGetValue(cacheKey, out HourlyWeatherForecastDto cached))
            {
                return cached;
            }

            var raw = await _weatherClient.GetHourlyWeatherForecastAsync(request.longi, request.lati, cancellationToken);

            var result = new HourlyWeatherForecastDto(
                raw.Latitude,
                raw.Longitude,
                new HourlyForecastData(
                    raw.Hourly.Time,
                    raw.Hourly.Temperature,
                    raw.Hourly.WeatherCode.Select(WeatherCodeMapper.ToWeatherType).ToList(),
                    raw.Hourly.WindSpeed,
                    raw.Hourly.Precipitation,
                    raw.Hourly.PrecipitationProbability
                )
            );
            _cache.Set(cacheKey, result, TimeSpan.FromHours(1));
            return result;
        }
    }
}
