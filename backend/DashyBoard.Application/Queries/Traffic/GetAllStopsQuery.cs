using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetAllStops;

public sealed record GetAllStopsQuery() : IRequest<IReadOnlyList<StationDto>>;