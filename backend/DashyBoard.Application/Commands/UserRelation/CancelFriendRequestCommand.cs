using MediatR;

namespace DashyBoard.Application.Commands.UserRelation;

public sealed record CancelFriendRequestCommand(
    string Username,
    Guid CurrentUserId
) : IRequest;
