using DashyBoard.Application.Queries.Location.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Location
{
    public sealed record GetCityByNameQuery(string CityName, string CountryCode) : IRequest<CityValidationResponseDto>;
}
