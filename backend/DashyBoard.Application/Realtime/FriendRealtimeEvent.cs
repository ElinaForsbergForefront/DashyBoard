namespace DashyBoard.Application.Realtime;

public static class FriendRealtimeEventTypes
{
    public const string FriendRequestSent = "friend-request-sent";
    public const string FriendRequestAccepted = "friend-request-accepted";
    public const string FriendRequestRejected = "friend-request-rejected";
    public const string FriendRequestCanceled = "friend-request-cancelled";
    public const string FriendRemoved = "friend-removed";
    public const string UserBlocked = "user-blocked";
    public const string UserUnblocked = "user-unblocked";
    public const string PokeSent = "poke-sent";
    public const string PokeSeen = "poke-seen";
    public const string PokeDismissed = "poke-dismissed";
}
public sealed record FriendRealtimeEvent
{
    public string EventType { get; init; } = string.Empty;
    public Guid User1Id { get; init; }
    public string? User1Username { get; init; }
    public string? User1DisplayName { get; init; }
    public Guid User2Id { get; init; }
    public string? User2Username { get; init; }
    public Guid? PokeId { get; init; }
    public DateTime OccurredAtUtc { get; init; }
    public bool ShouldToast { get; init; }
}