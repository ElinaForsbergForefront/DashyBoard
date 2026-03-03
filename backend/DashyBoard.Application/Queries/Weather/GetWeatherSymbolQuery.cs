using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed record GetWeatherSymbolQuery(string longi, string lati) : IRequest<WeatherSymbolDto>;
}