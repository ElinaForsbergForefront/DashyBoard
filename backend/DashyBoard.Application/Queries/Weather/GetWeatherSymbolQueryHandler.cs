using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed class GetWeatherSymbolQueryHandler : IRequestHandler<GetWeatherSymbolQuery, WeatherSymbolDto>
    {
        private readonly IWeatherApiClient _weatherClient;

        public GetWeatherSymbolQueryHandler(IWeatherApiClient weatherClient)
        {
            _weatherClient = weatherClient;
        }

        public async Task<WeatherSymbolDto> Handle(GetWeatherSymbolQuery request, CancellationToken cancellationToken)
        {
            return await _weatherClient.GetWeatherSymbolAsync(request.longi, request.lati, cancellationToken);
        }
    }
}
