using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetDepartures;

public sealed record GetDeparturesSpecificTimeQuery(string SiteId, string DateTime) : IRequest<IReadOnlyList<TimetableEntryDto>>;