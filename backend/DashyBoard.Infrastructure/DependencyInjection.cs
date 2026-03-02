using DashyBoard.Domain.Configuration;
using DashyBoard.Infrastructure.Configuration;
using DashyBoard.Application.Interfaces;         
using DashyBoard.Infrastructure.External;
using DashyBoard.Infrastructure.Client;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;


namespace DashyBoard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config)
    {

        // Gold API
        services.AddHttpClient<IGoldApiClient, GoldApiClient>(client =>
        {
            client.BaseAddress = new Uri("https://api.gold-api.com/");
        });

        services.AddScoped<IUserClient, UserClient>();

        //EF Core
        var cs = config.GetConnectionString("DefaultConnection")
                 ?? throw new InvalidOperationException("Missing connection string 'DefaultConnection'.");

        services.AddDbContext<DashyBoardDbContext>(options =>
            options.UseNpgsql(cs));

        // MongoDB
        services.Configure<MongoDbSettings>(
            config.GetSection(MongoDbSettings.SectionName));

        services.AddSingleton<IMongoClient>(sp =>
        {
            var settings = config
                .GetSection(MongoDbSettings.SectionName)
                .Get<MongoDbSettings>()
                ?? throw new InvalidOperationException("MongoDb settings not configured");
            return new MongoClient(settings.ConnectionString);
        });
        services.AddScoped<IMongoDatabase>(sp =>
        {
            var settings = config
                .GetSection(MongoDbSettings.SectionName)
                .Get<MongoDbSettings>()
                ?? throw new InvalidOperationException("MongoDb settings not configured");
            var client = sp.GetRequiredService<IMongoClient>();
            return client.GetDatabase(settings.DatabaseName);
        });

        // Configure Auth0 JWT Authentication
        services.Configure<Auth0Settings>(
            config.GetSection(Auth0Settings.SectionName));

        var auth0Settings = config
            .GetSection(Auth0Settings.SectionName)
            .Get<Auth0Settings>()
            ?? throw new InvalidOperationException("Auth0 settings not configured");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = $"https://{auth0Settings.Domain}/";
                options.Audience = auth0Settings.Audience;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = $"https://{auth0Settings.Domain}/",
                    ValidateAudience = true,
                    ValidAudience = auth0Settings.Audience,
                    ValidateLifetime = true,
                };
            });

        services.AddAuthorization();

        return services;
    }
}
