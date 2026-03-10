using DashyBoard.Application.Queries.Traffic.Dto;

namespace DashyBoard.Application.Interfaces;

public interface ITrafficApiClient
{
    //Task<IReadOnlyList<StationDto>> GetAllStopsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<StationDto>> GetStopByNameAsync(string name, CancellationToken ct = default);

    Task<IReadOnlyList<DepartureDto>> GetDeparturesAsync(string siteId, CancellationToken ct = default);
    Task<IReadOnlyList<DepartureDto>> GetDeparturesSpecificTimeAsync(string siteId, string dateTime, CancellationToken ct = default);

    Task<IReadOnlyList<ArrivalDto>> GetArrivalsAsync(string siteId, CancellationToken ct = default);
    Task<IReadOnlyList<ArrivalDto>> GetArrivalsSpecificTimeAsync(string siteId, string dateTime, CancellationToken ct = default);
}

