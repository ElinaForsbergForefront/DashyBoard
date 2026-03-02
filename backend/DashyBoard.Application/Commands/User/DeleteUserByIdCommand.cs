using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public sealed record DeleteUserByIdCommand(
        Guid UserId
        ) : IRequest;
    
}
