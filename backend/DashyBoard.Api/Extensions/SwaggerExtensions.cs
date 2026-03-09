using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;

namespace DashyBoard.Api.Extensions
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddApiSwagger(
            this IServiceCollection services,
            IConfiguration config)
        {
            var domain = config["Auth0:Domain"];

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "DashyBoard API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Auth0", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        AuthorizationCode = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri($"https://{domain}/authorize"),
                            TokenUrl = new Uri($"https://{domain}/oauth/token"),
                            Scopes = new Dictionary<string, string>
                            {
                                { "openid", "OpenID" },
                                { "profile", "Profile" },
                                { "email", "Email" }
                            }
                        }
                    }
                });

                options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecuritySchemeReference("Auth0", document),
                        new List<string> { "openid", "profile", "email" }
                    }
                });
            });

            return services;
        }
    }
}
