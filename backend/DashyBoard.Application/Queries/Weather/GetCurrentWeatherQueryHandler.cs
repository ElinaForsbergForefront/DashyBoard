using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetCurrentWeatherQueryHandler : IRequestHandler<GetCurrentWeatherQuery, CurrentWeatherDto>
    {
        private readonly IWeatherApiClient _weatherClient;

        public GetCurrentWeatherQueryHandler(IWeatherApiClient weatherClient)
        {
            _weatherClient = weatherClient;
        }

        public async Task<CurrentWeatherDto> Handle(GetCurrentWeatherQuery request, CancellationToken cancellationToken)
        {
            var raw = await _weatherClient.GetCurrentWeatherAsync(request.longi, request.lati, cancellationToken);

            return new CurrentWeatherDto(
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
        }
    }
}
