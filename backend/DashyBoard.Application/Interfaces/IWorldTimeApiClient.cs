using DashyBoard.Application.Queries.WorldTime.Dto;

namespace DashyBoard.Application.Interfaces;

public interface IWorldTimeApiClient
{
    Task<WorldTimeDto> GetTimeByTimezoneAsync(string timezone, CancellationToken ct);
}