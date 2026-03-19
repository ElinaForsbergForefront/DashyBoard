using DashyBoard.Application.Queries.Geocoding.Dto;

namespace DashyBoard.Application.Interfaces;

public interface IGeocodingApiClient
{
    Task<GeocodeResponseDto> GeocodeAddressAsync(string address, CancellationToken ct);
}
