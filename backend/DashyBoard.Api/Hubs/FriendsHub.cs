using System.Security.Claims;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DashyBoard.Api.Hubs;

[Authorize]
public sealed class FriendsHub : Hub 
{
    public const string FriendEventReceivedMethod = "FriendEventReceived";
    private readonly IUserSyncService _userSyncService;
    private readonly IMediator _mediator;
    private readonly ILogger<FriendsHub> _logger;

    public FriendsHub(IUserSyncService userSyncService, IMediator mediator, ILogger<FriendsHub> logger)
    {
        _userSyncService = userSyncService;
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
        {
            var sub = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? Context.User?.FindFirst("sub")?.Value;

            var email = Context.User?.FindFirst(ClaimTypes.Email)?.Value
                ?? Context.User?.FindFirst("email")?.Value;

            if (string.IsNullOrWhiteSpace(sub) || string.IsNullOrWhiteSpace(email))
            {
                _logger.LogWarning("FriendsHub connection rejected because auth claims were incomplete.");
                Context.Abort();
                return;
            }

            await _userSyncService.SyncUserFromAuthAsync(
                sub,
                email,
                username: null,
                displayName: null,
                country: null,
                city: null,
                Context.ConnectionAborted);

            var user = await _mediator.Send(new GetUserBySubQuery(sub), Context.ConnectionAborted);

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                FriendHubGroupNames.ForUser(user.Id),
                Context.ConnectionAborted);

            await base.OnConnectedAsync();
        }
}