using DashyBoard.Application.Queries.Traffic.Dto;

namespace DashyBoard.Application.Interfaces;

public interface ITrafficApiClient
{
    //Task<IReadOnlyList<StationDto>> GetAllStopsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<StationDto>> GetStopByNameAsync(string name, CancellationToken ct = default);

    Task<IReadOnlyList<TimetableEntryDto>> GetDeparturesAsync(string siteId, CancellationToken ct = default);
    Task<IReadOnlyList<TimetableEntryDto>> GetDeparturesSpecificTimeAsync(string siteId, string dateTime, CancellationToken ct = default);

    Task<IReadOnlyList<TimetableEntryDto>> GetArrivalsAsync(string siteId, CancellationToken ct = default);
    Task<IReadOnlyList<TimetableEntryDto>> GetArrivalsSpecificTimeAsync(string siteId, string dateTime, CancellationToken ct = default);
}

