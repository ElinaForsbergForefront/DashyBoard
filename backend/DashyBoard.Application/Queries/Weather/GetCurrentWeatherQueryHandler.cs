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
                raw.latitude,
                raw.longitude,
                new WeatherData(
                    raw.current.air_temperature,
                    raw.current.wind_speed,
                    WeatherCodeMapper.ToWeatherType(raw.current.weather_code),
                    raw.current.precipitation,
                    raw.current.precipitation_probability
                )
            );
        }
    }
}
