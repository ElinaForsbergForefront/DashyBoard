using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public sealed record DeleteUserBySubCommand(
        string Sub
        ) : IRequest;

}
