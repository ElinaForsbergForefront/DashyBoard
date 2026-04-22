using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Location;

public sealed class GetCityByNameQueryHandler : IRequestHandler<GetCityByNameQuery, CityValidationResponseDto>
{
    private readonly ICityApiClient _client;

    public GetCityByNameQueryHandler(ICityApiClient client)
    {
        _client = client;
    }

    public async Task<CityValidationResponseDto> Handle(GetCityByNameQuery request, CancellationToken cancellationToken)
    {
        var cities = await _client.GetCitiesByNameAsync(request.CityName, request.CountryCode, cancellationToken);

        return new CityValidationResponseDto(
            IsValid: cities.Count > 0,
            Results: cities
        );
    }
}