using DashyBoard.Application.Queries.WorldTime.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.WorldTime;

public sealed record GetAllTimezonesQuery : IRequest<IReadOnlyList<TimezoneDto>>;