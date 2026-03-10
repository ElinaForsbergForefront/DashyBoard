using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetArrivals;

public sealed record GetArrivalsSpecificTimeQuery(string SiteId, string DateTime) : IRequest<IReadOnlyList<ArrivalDto>>;