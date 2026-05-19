using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace DashyBoard.Api.Extensions
{
    public static class AuthenticationExtensions
    {
        public static IServiceCollection AddApiAuthentication(
            this IServiceCollection services,
            IConfiguration config)
        {
            var domain = config["Auth0:Domain"];
            var audience = config["Auth0:Audience"];

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = $"https://{domain}/";
                    options.Audience = audience;
                    options.TokenValidationParameters.NameClaimType = "sub";
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if (!string.IsNullOrWhiteSpace(accessToken)
                                && path.StartsWithSegments("/hubs/friends"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization();

            return services;
        }
    }
}
