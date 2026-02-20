using DashyBoard.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// MongoDB
builder.Services.AddInfrastructure(builder.Configuration);

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
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseUserSync();
app.UseAuthorization();

app.MapControllers();

app.Run();
