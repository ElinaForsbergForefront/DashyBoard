using DashyBoard.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DashyBoard.Infrastructure.External;

public class Auth0ManagementService : IAuth0ManagementService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<Auth0ManagementService> _logger;

    private string? _cachedToken;
    private DateTime _tokenExpiry = DateTime.MinValue;

    public Auth0ManagementService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<Auth0ManagementService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }
    public async Task SetUserDataStoredFlagAsync(string auth0UserId, CancellationToken ct)
    {
        try
        {
            var managementDomain = _configuration["Auth0:ManagementDomain"];
            var token = await GetManagementTokenAsync(ct);
            var client = _httpClientFactory.CreateClient("Auth0Management");
            client.DefaultRequestHeaders.Authorization = new("Bearer", token);

            var patchContent = new
            {
                app_metadata = new { user_data_stored = true }
            };

            var json = JsonSerializer.Serialize(patchContent);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Use full URL with custom domain
            var response = await client.PatchAsync($"https://{managementDomain}/api/v2/users/{auth0UserId}", content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError(
                    "Failed to set user_data_stored flag for user {UserId}: {StatusCode} {Error}",
                    auth0UserId,
                    response.StatusCode,
                    errorBody);
                response.EnsureSuccessStatusCode();
            }

            _logger.LogInformation("Set user_data_stored flag for user {UserId}", auth0UserId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting user_data_stored flag for user {UserId}", auth0UserId);
            throw;
        }
    }

    private async Task<string> GetManagementTokenAsync(CancellationToken ct)
    {
        // Returned cached token if still valid
        if (!string.IsNullOrEmpty(_cachedToken) && DateTime.UtcNow < _tokenExpiry)
        {
            return _cachedToken;
        }

        var managementDomain = _configuration["Auth0:ManagementDomain"];
        var clientId = _configuration["Auth0:ManagementClientId"];
        var clientSecret = _configuration["Auth0:ManagementClientSecret"];

        if (string.IsNullOrEmpty(managementDomain) || string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
        {
            throw new InvalidOperationException("Auth0 Management API credentials are not configured. Set Auth0:ManagementClientId and Auth0:ManagementClientSecret via user-secrets or environment variables.");
        }

        var client = _httpClientFactory.CreateClient("Auth0Management");
        var tokenRequest = new
        {
            client_id = clientId,
            client_secret = clientSecret,
            audience = $"https://{managementDomain}/api/v2/",
            grant_type = "client_credentials"
        };

        var json = JsonSerializer.Serialize(tokenRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await client.PostAsync($"https://{managementDomain}/oauth/token", content, ct);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            _logger.LogError(
                "Failed to obtain Auth0 management token: {StatusCode} {Error}",
                response.StatusCode,
                errorBody);
            response.EnsureSuccessStatusCode();
        }

        var responseBody = await response.Content.ReadAsStringAsync(ct);
        var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseBody);

        if (tokenResponse?.AccessToken == null)
        {
            throw new InvalidOperationException("Auth0 token response missing access_token");
        }

        _cachedToken = tokenResponse.AccessToken;
        _tokenExpiry = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 60);

        return _cachedToken;
    }

    private class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }
        
        [JsonPropertyName("expires_in")]
        public int ExpiresIn{ get; set; }
    }
}
