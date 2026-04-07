using DashyBoard.Application.Queries.Location.Dto;
using MediatR;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Queries.Location
{
    public class GetAllCountriesQueryHandler : IRequestHandler<GetAllCountriesQuery, IReadOnlyList<CountryDto>>
    {
        private readonly ILocationApiClient _client;

        public GetAllCountriesQueryHandler(ILocationApiClient client) => _client = client;

        public async Task<IReadOnlyList<CountryDto>> Handle(GetAllCountriesQuery request, CancellationToken cancellationToken)
        {
            return await _client.GetAllCountriesAsync(cancellationToken);
        }
    }
}
