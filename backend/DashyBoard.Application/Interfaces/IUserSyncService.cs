namespace DashyBoard.Application.Interfaces;

public interface IUserSyncService
{
    Task SyncUserFromAuthAsync(string authSub, string email, string? username, string? displayName, string? country, string? city, CancellationToken ct = default);
}
