namespace DashyBoard.Api.Hubs;

public static class FriendHubGroupNames
{
    public static string ForUser(Guid userId) => $"user:{userId}";
}