using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Geocoding.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.Geocoding;

public sealed class GeocodeAddressQueryHandler : IRequestHandler<GeocodeAddressQuery, GeocodeResponseDto?>
{
    private readonly IGeocodingApiClient _geocodingClient;

    public GeocodeAddressQueryHandler(IGeocodingApiClient geocodingClient)
    {
        _geocodingClient = geocodingClient;
    }

    public async Task<GeocodeResponseDto?> Handle(GeocodeAddressQuery request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Address))
        {
            return null;
        }

        return await _geocodingClient.GeocodeAddressAsync(request.Address, ct);
    }
}