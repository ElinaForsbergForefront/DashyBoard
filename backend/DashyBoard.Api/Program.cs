using DashyBoard.Api.Extensions;
using DashyBoard.Infrastructure;
using DashyBoard.Application;
using System.Text.Json.Serialization;
using DashyBoard.Api.Middleware;
using DashyBoard.Application.Interfaces;
using DashyBoard.Api.Realtime;
using DashyBoard.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Dependency Injection
builder.Services.AddInfrastructure(builder.Configuration);

//Mediator
builder.Services.AddApplication();

// Realtime
builder.Services.AddSignalR();
builder.Services.AddScoped<IFriendRealtimeNotifier, SignalRFriendRealtimeNotifier>();

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddSwaggerGen();
builder.Services.AddApiAuthentication(builder.Configuration);
builder.Services.AddApiSwagger(builder.Configuration);

builder.Services.AddMemoryCache();

var app = builder.Build();

app.UseGlobalExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.OAuthClientId(builder.Configuration["Auth0:SwaggerClientId"]);
        options.OAuthUsePkce();

        options.OAuthAdditionalQueryStringParams(new Dictionary<string, string>
        {
            ["audience"] = builder.Configuration["Auth0:Audience"]!
        });
    });
}

// CORS m�ste komma F�RE SecurityHeaders
app.UseCors("AllowFrontend");
app.UseSecurityHeaders();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseUserSync();

app.MapControllers();
app.MapHub<FriendsHub>("/hubs/friends").RequireAuthorization();

app.Run();
