namespace DashyBoard.Application.Interfaces;

public interface IAuth0ManagementService
{
    Task SetUserDataStoredFlagAsync(string auth0UserId, CancellationToken ct);
}
