using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public class DeleteUserByIdCommandHandler : IRequestHandler<DeleteUserByIdCommand>
    {
        private readonly IUserRepository _client;

        public DeleteUserByIdCommandHandler(IUserRepository client)
        {
            _client = client;
        }

        public Task Handle(DeleteUserByIdCommand request, CancellationToken cancellationToken)
        {
            return _client.DeleteUserByIdAsync(request.UserId, cancellationToken);
        }
    }
}
