using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetDepartures;

public sealed record GetDeparturesQuery(string SiteId) : IRequest<IReadOnlyList<TimetableEntryDto>>;