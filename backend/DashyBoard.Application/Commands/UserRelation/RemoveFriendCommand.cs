using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record RemoveFriendCommand(
        string Username,
        Guid CurrentUserId
    ) : IRequest;
}