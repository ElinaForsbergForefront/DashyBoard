using DashyBoard.Application.Interfaces;
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
            return await _weatherClient.GetWeatherForecastAsync(request.longi, request.lati, cancellationToken);
        }
    }
}
