using DashyBoard.Application.Interfaces;         
using DashyBoard.Domain.Configuration;
using DashyBoard.Infrastructure.Configuration;
using DashyBoard.Infrastructure.External;
using DashyBoard.Infrastructure.External.Location;
using DashyBoard.Infrastructure.Repositories;
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

		// World Time API
		services.AddHttpClient<IWorldTimeApiClient, WorldTimeApiClient>(client =>
		{
			client.BaseAddress = new Uri("https://timeapi.io/");
		});
    
		// Weather API
		services.AddHttpClient<IWeatherApiClient, WeatherApiClient>(client =>
		{
			client.BaseAddress = new Uri("https://api.open-meteo.com/v1/");
		});

        // Location API
		services.AddHttpClient<ILocationApiClient, LocationApiClient>(client =>
		{
			client.BaseAddress = new Uri("https://restcountries.com/v3.1/");
		});

        //city API
        services.AddHttpClient<ICityApiClient, CityApiClient>(client =>
        {
            client.BaseAddress = new Uri("https://api.geoapify.com/v1/");
        });

		// Nominatim Geocoding API
		services.AddHttpClient<IGeocodingApiClient, NominatimApiClient>(client =>
		{
			client.BaseAddress = new Uri("https://nominatim.openstreetmap.org/");
			client.DefaultRequestHeaders.Add("User-Agent", "DashyBoard/1.0");
			client.Timeout = TimeSpan.FromSeconds(10);
		});

		// Yahoo Finance API 
        services.AddHttpClient<ICurrencyApiClient, CurrencyApiClient>(client =>
        {
            client.BaseAddress = new Uri("https://query2.finance.yahoo.com/");
            client.DefaultRequestHeaders.Add("User-Agent", "DashyBoard/1.0");
            client.Timeout = TimeSpan.FromSeconds(15);
        });

        // TrafikLab Realtime API
        services.AddHttpClient<ITrafficApiClient, TrafficApiClient>(client =>
        {
            client.BaseAddress = new Uri("https://realtime-api.trafiklab.se/v1/");
        });

        // Mirror
        services.AddScoped<IMirrorRepository, MirrorRepository>();

        //Reminders
        services.AddScoped<IReminderRepository, ReminderRepository>();

        // Users
		services.AddScoped<IUserRepository, UserRepository>();

		// Friends
		services.AddScoped<IFriendRepository, FriendRepository>();

        // Spotify
		services.Configure<SpotifyOptions>(
		config.GetSection(SpotifyOptions.SectionName));

        //EF Core
        var cs = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing connection string 'DefaultConnection'.");

		services.AddDbContext<DashyBoardDbContext>(options =>
			options.UseNpgsql(cs));

		// MongoDB
		MongoDbConfigurator.Configure();

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
