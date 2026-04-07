using DashyBoard.Application.Queries.Location.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Location
{
    public record GetAllCountriesQuery : IRequest<IReadOnlyList<CountryDto>>;
}
