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
                });

            services.AddAuthorization();

            return services;
        }
    }
}
