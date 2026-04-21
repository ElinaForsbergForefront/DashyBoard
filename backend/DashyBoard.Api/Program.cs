using DashyBoard.Api.Extensions;
using DashyBoard.Infrastructure;
using DashyBoard.Application;
using System.Text.Json.Serialization;
using DashyBoard.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Dependency Injection
builder.Services.AddInfrastructure(builder.Configuration);

//Mediator
builder.Services.AddApplication();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
              "http://localhost:5173",
              "https://dashyboard.se",
              "https://www.dashyboard.se",
              "https://localhost:7298",
              "http://localhost:7298")
              "https://www.auth.dashyboard.se",
              "https://auth.dashyboard.se")
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

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseUserSync();
app.MapControllers();

app.Run();
