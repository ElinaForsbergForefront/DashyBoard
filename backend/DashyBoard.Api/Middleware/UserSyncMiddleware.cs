using DashyBoard.Domain.Models;
using DashyBoard.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Security.Claims;

namespace DashyBoard.Api.Middleware;

public class UserSyncMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserSyncMiddleware> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    public UserSyncMiddleware(RequestDelegate next, ILogger<UserSyncMiddleware> logger, IServiceScopeFactory scopeFactory)
    {
        _next = next;
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var sub = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? context.User.FindFirst("sub")?.Value;

            var email = context.User.FindFirst(ClaimTypes.Email)?.Value
                ?? context.User.FindFirst("email")?.Value;

            if (!string.IsNullOrEmpty(sub) && !string.IsNullOrEmpty(email))
            {
                    await SyncUserAsync(sub, email);
            }
        }

        await _next(context);
    }

    private async Task SyncUserAsync(string sub, string email)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<DashyBoardDbContext>();

        db.Users.Add(new User(sub, email));

        try
        {
            await db.SaveChangesAsync();
            _logger.LogInformation("New user created: {Sub}", sub);
        }
        catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
        {
            _logger.LogInformation("User already exists: {Sub}", sub);
        }
    }
    private static bool IsUniqueConstraintViolation(DbUpdateException ex)
    {
        return ex.InnerException is PostgresException postgresEx
               && postgresEx.SqlState == "23505"; // unique_violation
    }
}

public static class UserSyncMiddlewareExtensions
{
    public static IApplicationBuilder UseUserSync(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<UserSyncMiddleware>();
    }
}