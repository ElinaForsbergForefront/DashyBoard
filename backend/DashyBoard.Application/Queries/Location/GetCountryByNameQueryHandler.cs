using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Location
{
    public class GetCountryByNameQueryHandler : IRequestHandler<GetCountryByNameQuery, IReadOnlyList<CountryDto>>
    {
        private readonly ILocationApiClient _client;
        public GetCountryByNameQueryHandler(ILocationApiClient client) => _client = client;

        public async Task<IReadOnlyList<CountryDto>> Handle(GetCountryByNameQuery request, CancellationToken cancellationToken)
        {
            var country = await _client.GetCountryByNameAsync(request.Name, cancellationToken);
            return country;
        }
    }
}
