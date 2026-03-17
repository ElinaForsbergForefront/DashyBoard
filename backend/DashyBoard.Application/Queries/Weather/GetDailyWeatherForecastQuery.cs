using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Weather
{
    public sealed record GetDailyWeatherForecastQuery(string longi, string lati) : IRequest<DailyWeatherForecastDto>;
}
