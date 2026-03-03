using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public sealed record UpdateUserBySubCommand(string sub, string? username, string? displayName, string? country, string? city) : IRequest<UserDto>;
}
