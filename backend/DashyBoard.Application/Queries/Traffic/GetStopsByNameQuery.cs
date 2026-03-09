using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetStopByName;

public sealed record GetStopByNameQuery(string Name) : IRequest<IReadOnlyList<StationDto>>;