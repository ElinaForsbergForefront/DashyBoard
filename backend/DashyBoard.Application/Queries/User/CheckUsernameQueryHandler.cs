using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Queries.User
{
    public class CheckUsernameQueryHandler : IRequestHandler<CheckUsernameQuery, bool>
    {
        private readonly IUserRepository _userRepository;

        public CheckUsernameQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(CheckUsernameQuery request, CancellationToken cancellationToken)
        {
            return await _userRepository.IsUsernameTakenAsync(request.Username, cancellationToken);
        }
    }
}