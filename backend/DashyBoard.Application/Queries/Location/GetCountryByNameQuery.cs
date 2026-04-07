using MediatR;
using DashyBoard.Application.Queries.Location.Dto;

namespace DashyBoard.Application.Queries.Location
{
    public sealed record GetCountryByNameQuery(string Name) : IRequest<IReadOnlyList<CountryDto>>;
}
