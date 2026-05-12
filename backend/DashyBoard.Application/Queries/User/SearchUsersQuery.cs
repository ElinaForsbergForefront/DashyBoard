using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.User;

public sealed record SearchUsersQuery(string SearchTerm, Guid CurrentUserId) : IRequest<IReadOnlyList<UserDto>>;