using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Queries.Location.Dto;  
using DashyBoard.Application.Interfaces;


namespace DashyBoard.Application.Queries.Location
{
    public sealed class GetCityByNameQueryHandler : IRequestHandler<GetCityByNameQuery, IReadOnlyList<CityDto>>
    {
        private readonly ICityApiClient _client;

        public GetCityByNameQueryHandler(ICityApiClient client)
        {
            _client = client;
        }

        public async Task<IReadOnlyList<CityDto>> Handle(GetCityByNameQuery request,CancellationToken cancellationToken)
        {
            return await _client.GetCitiesByNameAsync(request.CityName, request.CountryCode, cancellationToken);
        }
    }
}
