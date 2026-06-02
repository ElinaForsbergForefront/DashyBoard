using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetCurrentWeatherQueryHandler : IRequestHandler<GetCurrentWeatherQuery, CurrentWeatherDto>
    {
        private readonly IWeatherApiClient _weatherClient;
        private readonly IMemoryCache _cache;

        public GetCurrentWeatherQueryHandler(IWeatherApiClient weatherClient, IMemoryCache cache)
        {
            _weatherClient = weatherClient;
            _cache = cache;
        }

        public async Task<CurrentWeatherDto> Handle(GetCurrentWeatherQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"current-weather:{request.longi}:{request.lati}";
            if (_cache.TryGetValue(cacheKey, out CurrentWeatherDto? cached) && cached is not null)
            {
            return cached;
            }
            var raw = await _weatherClient.GetCurrentWeatherAsync(request.longi, request.lati, cancellationToken);

            var result = new CurrentWeatherDto(
                raw.Latitude,
                raw.Longitude,
                new WeatherData(
                    raw.Current.AirTemperature,
                    raw.Current.ApperentTemperature,
                    raw.Current.WindSpeed,
                    WeatherCodeMapper.ToWeatherType(raw.Current.WeatherCode),
                    raw.Current.Precipitation,
                    raw.Current.PrecipitationProbability,
                    raw.Current.Day
                )
            );

            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
            return result;
        }
    }
}
