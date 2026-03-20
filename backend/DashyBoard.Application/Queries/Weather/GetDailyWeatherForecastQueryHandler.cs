using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetDailyWeatherForecastQueryHandler : IRequestHandler<GetDailyWeatherForecastQuery, DailyWeatherForecastDto>
    {
        private readonly IWeatherApiClient _weatherClient;
        public GetDailyWeatherForecastQueryHandler(IWeatherApiClient weatherClient)
        {
            _weatherClient = weatherClient;
        }

        public async Task<DailyWeatherForecastDto> Handle(GetDailyWeatherForecastQuery request, CancellationToken cancellationToken)
        {
            var raw = await _weatherClient.GetDailyWeatherForecastAsync(request.longi, request.lati, cancellationToken);
            return new DailyWeatherForecastDto(
                raw.Latitude,
                raw.Longitude,
                new DailyForecastData(
                    raw.Daily.Time,
                    raw.Daily.WeatherCode.Select(WeatherCodeMapper.ToWeatherType).ToList(),
                    raw.Daily.TemperatureMax,
                    raw.Daily.TemperatureMin
                )
            );
        }
    }
}
