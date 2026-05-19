using MediatR;

namespace DashyBoard.Application.Commands.UserRelation;

public sealed record RejectFriendRequestCommand(
    string Username,
    Guid CurrentUserId
) : IRequest;