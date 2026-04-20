using DashyBoard.Application.Interfaces;
using DashyBoard.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace DashyBoard.Infrastructure.Services;

public class UserSyncService : IUserSyncService
{
    private readonly DashyBoardDbContext _context;
    private readonly ILogger<UserSyncService> _logger;

    public UserSyncService(DashyBoardDbContext context, ILogger<UserSyncService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SyncUserFromAuthAsync(
        string authSub,
        string email,
        string? username,
        string? displayName,
        string? country,
        string? city,
        CancellationToken ct = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.AuthSub == authSub, ct);

        if (user?.Username != null)
        {
            // User already synced - no action needed
            return;
        }

        if (user == null)
        {
            await CreateNewUserAsync(authSub, email, username, displayName, country, city, ct);
        }
        else if (username != null)
        {
            await UpdateExistingUserAsync(user, username, displayName, country, city, ct);
        }
    }

    private async Task CreateNewUserAsync(
        string authSub,
        string email,
        string? username,
        string? displayName,
        string? country,
        string? city,
        CancellationToken ct)
    {
        _context.Users.Add(new User(authSub, email, username, displayName, country, city));

        try
        {
            await _context.SaveChangesAsync(ct);
            _logger.LogInformation("New user created: {Sub}", authSub);
        }
        catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
        {
            _logger.LogInformation("User already exists (race condition): {Sub}", authSub);
        }
    }

    private async Task UpdateExistingUserAsync(
        User user,
        string username,
        string? displayName,
        string? country,
        string? city,
        CancellationToken ct)
    {
        user.Update(username, displayName, country, city);
        await _context.SaveChangesAsync(ct);
        _logger.LogInformation("Updated profile for existing user: {Sub}", user.AuthSub);
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException { SqlState: "23505" };
}