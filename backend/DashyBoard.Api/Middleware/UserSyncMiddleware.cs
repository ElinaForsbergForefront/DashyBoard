using System.Security.Claims;

namespace DashyBoard.Api.Middleware;

public class UserSyncMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserSyncMiddleware> _logger;

    public UserSyncMiddleware(RequestDelegate next, ILogger<UserSyncMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var sub = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? context.User.FindFirst("sub")?.Value;

            var email = context.User.FindFirst(ClaimTypes.Email)?.Value
                ?? context.User.FindFirst("email")?.Value;

            if (!string.IsNullOrEmpty(sub))
            {
                _logger.LogInformation("Authenticated user - Sub: {sub}, Email: {Email}", sub, email);
            }
        }
        await _next(context);
    }
}

public static class UserSyndMiddlewareExtensions
{
    public static IApplicationBuilder UseUserSync(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<UserSyncMiddleware>();
    }
}