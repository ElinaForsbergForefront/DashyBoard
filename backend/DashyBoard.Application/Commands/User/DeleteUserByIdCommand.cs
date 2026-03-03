using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public sealed record DeleteUserByIdCommand(
        Guid UserId
        ) : IRequest;
    
}
