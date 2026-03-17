using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed record GetCurrentWeatherQuery(string longi, string lati) : IRequest<CurrentWeatherDto>;
}