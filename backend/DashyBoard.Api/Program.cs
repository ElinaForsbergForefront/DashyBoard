using DashyBoard.Domain.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Bind MongoDB settings from configuration
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection(MongoDbSettings.SectionName));

// Bind Auth0 settings from configuration
builder.Services.Configure<Auth0Settings>(
    builder.Configuration.GetSection(Auth0Settings.SectionName));

// Register MongoDB client
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = builder.Configuration
        .GetSection(MongoDbSettings.SectionName)
        .Get<MongoDbSettings>()
        ?? throw new InvalidOperationException("MongoDB settings not configured");

    return new MongoClient(settings.ConnectionString);
});

// Register IMongoDatabase
builder.Services.AddScoped<IMongoDatabase>(sp =>
{
    var settings = builder.Configuration
        .GetSection(MongoDbSettings.SectionName)
        .Get<MongoDbSettings>()
        ?? throw new InvalidOperationException("MongoDB settings not configured");

    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});

// Configure Auth0 JWT Authentication
var auth0Settings = builder.Configuration
    .GetSection(Auth0Settings.SectionName)
    .Get<Auth0Settings>()
    ?? throw new InvalidOperationException("Auth0 settings not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
