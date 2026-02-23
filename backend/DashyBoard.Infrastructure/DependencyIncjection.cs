using DashyBoard.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace DashyBoard.Infrastructure;

public static class DependencyIncjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config)
    {

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
        return services;
    }
}
