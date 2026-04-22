using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Spotify;
using DashyBoard.Domain.Models;
using DashyBoard.Infrastructure;
using DashyBoard.Infrastructure.Configuration;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace DashyBoard.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SpotifyController : ControllerBase
    {
        private const string StateCookieName = "spotify_oauth_state";

        private readonly IOptions<SpotifyOptions> _spotifyOptions;
        private readonly ISpotifyTokenClient _spotifyTokenClient;
        private readonly ISpotifyConnectionRepository _spotifyConnectionRepository;
        private readonly IMediator _mediator;
        private readonly DashyBoardDbContext _dbContext;
        private readonly IOAuthStateCache _oauthStateCache;

        public SpotifyController(
            IOptions<SpotifyOptions> spotifyOptions,
            ISpotifyTokenClient spotifyTokenClient,
            ISpotifyConnectionRepository spotifyConnectionRepository,
            IMediator mediator,
            DashyBoardDbContext dbContext,
            IOAuthStateCache oauthStateCache)
        {
            _spotifyOptions = spotifyOptions;
            _spotifyTokenClient = spotifyTokenClient;
            _spotifyConnectionRepository = spotifyConnectionRepository;
            _mediator = mediator;
            _dbContext = dbContext;
            _oauthStateCache = oauthStateCache;
        }


        [HttpGet("login-url")]
        public async Task<IActionResult> GetLoginUrl(CancellationToken cancellationToken)
        {
            var userId = await ResolveCurrentUserIdAsync(cancellationToken);
            if (userId is null)
            {
                return Unauthorized();
            }

            // Generate cryptographically secure state
            var state = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
                .TrimEnd('=').Replace('+', '-').Replace('/', '_');

            // Store state in cache with TTL (5-10 minutes)
            await _oauthStateCache.SetAsync(state, userId.Value, TimeSpan.FromMinutes(10), cancellationToken);

            var scope = "user-read-currently-playing user-read-playback-state";

            var authorizeUrl =
                "https://accounts.spotify.com/authorize" +
                $"?client_id={Uri.EscapeDataString(_spotifyOptions.Value.ClientId)}" +
                $"&response_type=code" +
                $"&redirect_uri={Uri.EscapeDataString(_spotifyOptions.Value.RedirectUri)}" +
                $"&state={Uri.EscapeDataString(state)}" +
                $"&scope={Uri.EscapeDataString(scope)}";

            return Ok(new { url = authorizeUrl });
        }

        [AllowAnonymous]
        [HttpGet("callback")]
        public async Task<IActionResult> Callback(
            [FromQuery] string? code,
            [FromQuery] string? state,
            [FromQuery] string? error,
            CancellationToken cancellationToken)
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                return BadRequest($"Spotify authorization failed: {error}");
            }

            if (string.IsNullOrWhiteSpace(code))
            {
                return BadRequest("Spotify did not return an authorization code.");
            }

            if (string.IsNullOrWhiteSpace(state))
            {
                return BadRequest("Missing Spotify state.");
            }

            // Validate state from cache (prevents CSRF and replay attacks)
            var userId = await _oauthStateCache.GetAndRemoveAsync(state, cancellationToken);
            if (userId is null)
            {
                return BadRequest("Invalid or expired OAuth state.");
            }

            var tokenResponse = await _spotifyTokenClient.ExchangeCodeAsync(code, cancellationToken);
            var expiresAtUtc = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

            var existingConnection = await _spotifyConnectionRepository.GetByUserIdAsync(userId.Value, cancellationToken);

            if (existingConnection is null)
            {
                if (string.IsNullOrWhiteSpace(tokenResponse.RefreshToken))
                {
                    return BadRequest("Spotify did not return a refresh token.");
                }

                var connection = new SpotifyConnection(
                    userId.Value,
                    tokenResponse.AccessToken,
                    tokenResponse.RefreshToken,
                    expiresAtUtc);

                await _spotifyConnectionRepository.AddAsync(connection, cancellationToken);
            }
            else
            {
                existingConnection.UpdateTokens(
                    tokenResponse.AccessToken,
                    tokenResponse.RefreshToken,
                    expiresAtUtc);

                _spotifyConnectionRepository.Update(existingConnection);
            }

            await _spotifyConnectionRepository.SaveChangesAsync(cancellationToken);

            var redirectUri = string.IsNullOrWhiteSpace(_spotifyOptions.Value.FrontendCallbackUri)
                ? "/"
                : _spotifyOptions.Value.FrontendCallbackUri;

            return Redirect(redirectUri);
        }

        [HttpGet("now-playing")]
        public async Task<IActionResult> GetNowPlaying(CancellationToken cancellationToken)
        {
            var userId = await ResolveCurrentUserIdAsync(cancellationToken);
            if (userId is null)
            {
                return Unauthorized();
            }

            // Check if user has a Spotify connection first
            var connection = await _spotifyConnectionRepository.GetByUserIdAsync(userId.Value, cancellationToken);
            if (connection is null)
            {
                return NotFound(new { message = "Spotify not connected" });
            }

            var result = await _mediator.Send(new GetSpotifyNowPlayingQuery(userId.Value), cancellationToken);

            if (result is null)
            {
                return NoContent(); // Nothing playing
            }

            return Ok(result);
        }

        private async Task<Guid?> ResolveCurrentUserIdAsync(CancellationToken cancellationToken)
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrWhiteSpace(sub))
            {
                return null;
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.AuthSub == sub, cancellationToken);
            return user?.Id;
        }
    }
}