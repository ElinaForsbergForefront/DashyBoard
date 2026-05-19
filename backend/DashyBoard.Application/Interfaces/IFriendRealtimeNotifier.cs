using DashyBoard.Application.Realtime;

namespace DashyBoard.Application.Interfaces;

public interface IFriendRealtimeNotifier
{
    Task NotifyAsync(Guid recipientUserId, FriendRealtimeEvent realtimeEvent, CancellationToken ct = default);
}