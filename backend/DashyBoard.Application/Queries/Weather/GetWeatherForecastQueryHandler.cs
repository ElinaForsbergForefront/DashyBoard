using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetWeatherForecastQueryHandler : IRequestHandler<GetWeatherForecastQuery, WeatherForecastDto>
    {
        private readonly IWeatherApiClient _weatherClient;

        public GetWeatherForecastQueryHandler(IWeatherApiClient weatherClient)
        {
            _weatherClient = weatherClient;
        }

        public async Task<WeatherForecastDto> Handle(GetWeatherForecastQuery request, CancellationToken cancellationToken)
        {
            var raw = await _weatherClient.GetWeatherForecastAsync(request.longi, request.lati, cancellationToken);

            return new WeatherForecastDto(
                raw.Latitude,
                raw.Longitude,
                new Forecast(
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
