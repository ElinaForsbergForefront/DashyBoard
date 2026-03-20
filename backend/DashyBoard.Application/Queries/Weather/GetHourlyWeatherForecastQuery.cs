using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed record GetHourlyWeatherForecastQuery(string longi, string lati) : IRequest<HourlyWeatherForecastDto>;
}
