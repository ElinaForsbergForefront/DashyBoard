using MediatR;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Commands.User
{
    public class DeleteUserBySubCommandHandler : IRequestHandler<DeleteUserBySubCommand>
    {
        private readonly IUserRepository _client;
        public DeleteUserBySubCommandHandler(IUserRepository client)
        {
            _client = client;
        }
        public Task Handle(DeleteUserBySubCommand command, CancellationToken cancellationToken)
        {
            return _client.DeleteUserBySubAsync(command.Sub, cancellationToken);
        }
    }
}
