using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed record GetWeatherForecastQuery(string longi, string lati) : IRequest<WeatherForecastDto>;
}
