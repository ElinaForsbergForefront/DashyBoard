using MediatR;
using DashyBoard.Application.Queries.User.Dto;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Queries.User
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>   
    {
        private readonly IUserRepository _userClient;

        public GetUserByIdQueryHandler(IUserRepository userClient)
        {
            _userClient = userClient;
        }

        public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            return await _userClient.GetUserByIdAsync(request.Id, cancellationToken);
        }

    }
}
