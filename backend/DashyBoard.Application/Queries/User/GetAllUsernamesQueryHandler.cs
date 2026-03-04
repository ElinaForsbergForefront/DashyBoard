using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Queries.User
{
    public class GetAllUsernamesQueryHandler : IRequestHandler<GetAllUsernamesQuery, IEnumerable<string>>
    {
        private readonly IUserRepository _userRepository;

        public GetAllUsernamesQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<string>> Handle(GetAllUsernamesQuery request, CancellationToken cancellationToken)
        {
            return await _userRepository.GetAllUsernamesAsync(cancellationToken);
        }
    }
}
