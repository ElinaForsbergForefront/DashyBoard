using DashyBoard.Application.Interfaces;
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
            return await _weatherClient.GetCurrentWeatherAsync(request.longi, request.lati, cancellationToken);
        }
    }
}
