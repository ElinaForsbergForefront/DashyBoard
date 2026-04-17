using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.User;

public class SyncUserToDbCommand : IRequest<UserDto>
{
    public string Sub { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string? DisplayName { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
}

public class SyncUserToDbCommandHandler : IRequestHandler<SyncUserToDbCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IAuth0ManagementService _auth0ManagementService;

    public SyncUserToDbCommandHandler(
        IUserRepository userRepository,
        IAuth0ManagementService auth0ManagementService)
    {
        _userRepository = userRepository;
        _auth0ManagementService = auth0ManagementService;
    }

    public async Task<UserDto> Handle(SyncUserToDbCommand request, CancellationToken ct)
    {
        // Upsert user in database
        var userDto = await _userRepository.CreateOrUpdateUserBySubAsync(
            request.Sub,
            request.Email,
            request.Username,
            request.DisplayName,
            request.Country,
            request.City,
            ct);

        // Set the flag in Auth0 app_metadata
        await _auth0ManagementService.SetUserDataStoredFlagAsync(request.Sub, ct);

        return userDto;
    }
}