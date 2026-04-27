using Microsoft.AspNetCore.Http;

namespace DashyBoard.Api.Middleware;

/// <summary>
/// Middleware that adds security headers to all HTTP responses.
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Don't add security headers to OPTIONS requests (CORS preflight)
        if (context.Request.Method != HttpMethods.Options)
        {
            // Content Security Policy - Prevents XSS attacks
            context.Response.Headers.Append("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' data:; " +
                "connect-src 'self' http://localhost:5173 https://dashyboard.se https://auth.dashyboard.se https://www.dashyboard.se https://www.auth.dashyboard.se; " +
                "frame-ancestors 'none';");

            // Strict Transport Security - Enforces HTTPS (only in production)
            if (!context.Request.Host.Host.Contains("localhost"))
            {
                context.Response.Headers.Append("Strict-Transport-Security", 
                    "max-age=31536000; includeSubDomains; preload");
            }

            // X-Content-Type-Options - Prevents MIME sniffing
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");

            // X-Frame-Options - Prevents clickjacking
            context.Response.Headers.Append("X-Frame-Options", "DENY");

            // X-XSS-Protection - Legacy XSS protection (for older browsers)
            context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");

            // Referrer-Policy - Controls referrer information
            context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

            // Permissions-Policy - Controls browser features
            context.Response.Headers.Append("Permissions-Policy", 
                "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");
        }

        await _next(context);
    }
}

public static class SecurityHeadersMiddlewareExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder builder) =>
        builder.UseMiddleware<SecurityHeadersMiddleware>();
}