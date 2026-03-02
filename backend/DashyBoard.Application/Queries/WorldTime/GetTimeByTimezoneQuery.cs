using DashyBoard.Application.Queries.WorldTime.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.WorldTime;

public sealed record GetTimeByTimezoneQuery(string Timezone) : IRequest<WorldTimeDto>;