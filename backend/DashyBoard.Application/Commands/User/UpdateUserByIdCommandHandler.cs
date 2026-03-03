using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public class UpdateUserByIdCommandHandler : IRequestHandler<UpdateUserByIdCommand, UserDto>
    {
        private readonly IUserRepository _repository;

        public UpdateUserByIdCommandHandler(IUserRepository repository)
        {
            _repository = repository;
        }

        public Task<UserDto> Handle(UpdateUserByIdCommand command, CancellationToken cancellationToken)
        {
            return _repository.UpdateUserByIdAsync(command.Id, command.Username, command.DisplayName, command.Country, command.City, cancellationToken);
        }
    }
}
