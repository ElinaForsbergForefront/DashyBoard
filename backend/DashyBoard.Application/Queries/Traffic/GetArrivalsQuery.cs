using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetArrivals;

public sealed record GetArrivalsQuery(string SiteId) : IRequest<IReadOnlyList<TimetableEntryDto>>;