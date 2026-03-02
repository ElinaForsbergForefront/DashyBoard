using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Queries.User.Dto;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Queries.User
{
    public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserDto>   
    {
        private readonly IUserClient _userClient;

        public GetUserQueryHandler(IUserClient userClient)
        {
            _userClient = userClient;
        }

        public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            return await _userClient.GetUserNameAsync(request.Id, cancellationToken);
        }

    }
}
