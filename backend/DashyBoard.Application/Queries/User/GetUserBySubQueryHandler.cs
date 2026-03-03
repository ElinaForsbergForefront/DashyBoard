using DashyBoard.Application.Interfaces;
using MediatR;
using DashyBoard.Application.Queries.User.Dto;

namespace DashyBoard.Application.Queries.User
{
    public class GetUserBySubQueryHandler: IRequestHandler<GetUserBySubQuery, UserDto>
    {
        private readonly IUserRepository _userClient;

        public GetUserBySubQueryHandler(IUserRepository userClient)
        {
            _userClient = userClient;
        }

        public async Task<UserDto> Handle(GetUserBySubQuery request, CancellationToken cancellationToken)
        {
            return await _userClient.GetUserBySubAsync(request.Sub, cancellationToken);
        }
    }
}
