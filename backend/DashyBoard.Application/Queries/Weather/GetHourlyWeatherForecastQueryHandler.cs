using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetHourlyWeatherForecastQueryHandler : IRequestHandler<GetHourlyWeatherForecastQuery, HourlyWeatherForecastDto>
    {
        private readonly IWeatherApiClient _weatherClient;

        public GetHourlyWeatherForecastQueryHandler(IWeatherApiClient weatherClient)
        {
            _weatherClient = weatherClient;
        }

        public async Task<HourlyWeatherForecastDto> Handle(GetHourlyWeatherForecastQuery request, CancellationToken cancellationToken)
        {
            var raw = await _weatherClient.GetHourlyWeatherForecastAsync(request.longi, request.lati, cancellationToken);

            return new HourlyWeatherForecastDto(
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
        }
    }
}
