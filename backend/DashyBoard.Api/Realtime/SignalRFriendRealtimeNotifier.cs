using DashyBoard.Api.Hubs;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Realtime;
using Microsoft.AspNetCore.SignalR;

namespace DashyBoard.Api.Realtime;

public sealed class SignalRFriendRealtimeNotifier : IFriendRealtimeNotifier
{
    private readonly IHubContext<FriendsHub> _hubContext;

    public SignalRFriendRealtimeNotifier(IHubContext<FriendsHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task NotifyAsync(Guid recipientUserId, FriendRealtimeEvent realtimeEvent, CancellationToken ct)
    {
        return _hubContext.Clients
            .Group(FriendHubGroupNames.ForUser(recipientUserId))
            .SendAsync(FriendsHub.FriendEventReceivedMethod, realtimeEvent, ct);
    }
}