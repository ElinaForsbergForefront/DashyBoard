using DashyBoard.Application.Queries.User.Dto;  
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Commands.User
{
    public class UpdateUserBySubCommandHandler : IRequestHandler<UpdateUserBySubCommand, UserDto>
    {
        private readonly IUserRepository _repository;

        public UpdateUserBySubCommandHandler(IUserRepository repository)
        {
            _repository = repository;
        }

        public Task<UserDto> Handle(UpdateUserBySubCommand command, CancellationToken cancellationToken)
        {
            return _repository.UpdateUserBySubAsync(command.sub, command.username, command.displayName, command.country, command.city, cancellationToken);
        }
    }
}
