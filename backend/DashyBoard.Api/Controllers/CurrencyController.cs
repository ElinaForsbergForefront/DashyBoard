using DashyBoard.Application.Commands.Currency;
using DashyBoard.Application.Queries.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DashyBoard.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CurrencyController : ControllerBase
{
    private readonly IMediator _mediator;

    public CurrencyController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("chart/{symbol}")]
    [ProducesResponseType(typeof(CurrencyChartDataDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrencyChart(
        string symbol,
        [FromQuery] DateTime? start = null,
        [FromQuery] DateTime? end = null,
        [FromQuery] string interval = "1d",
        CancellationToken ct = default)
    {
        try
        {
            var startUtc = start.HasValue
                ? (start.Value.Kind == DateTimeKind.Utc ? start.Value : DateTime.SpecifyKind(start.Value, DateTimeKind.Utc))
                : DateTime.UtcNow.AddDays(-1);

            var endUtc = end.HasValue 
                ? (end.Value.Kind == DateTimeKind.Utc ? end.Value : DateTime.SpecifyKind(end.Value, DateTimeKind.Utc))
                : DateTime.UtcNow;

            var result = await _mediator.Send(
                new GetCurrencyChartQuery(symbol, startUtc, endUtc, interval),
                ct);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(CurrencySearchDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SearchCurrencies(
    [FromQuery] string q,
    CancellationToken ct = default)
    {
        try
        {
            var result = await _mediator.Send(
                new SearchCurrenciesQuery(q),
                ct);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }

    [HttpGet("favorites")]
    [ProducesResponseType(typeof(List<FavoriteCurrencyDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserFavorites(CancellationToken ct = default)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            var result = await _mediator.Send(new GetUserFavoritesQuery(userId), ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }

    [HttpPost("favorites/{symbol}")]
    [ProducesResponseType(typeof(FavoriteCurrencyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddFavoriteCurrency(string symbol, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(symbol))
                return BadRequest(new { error = "Symbol cannot be empty." });

            var userId = GetUserIdFromClaims();
            var result = await _mediator.Send(
                new AddFavoriteCurrencyCommand(userId, symbol),
                ct);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("maximum"))
        {
            return Conflict(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }

    [HttpDelete("favorites/{symbol}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveFavoriteCurrency(string symbol, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(symbol))
                return BadRequest(new { error = "Symbol cannot be empty." });

            var userId = GetUserIdFromClaims();
            await _mediator.Send(
                new RemoveFavoriteCurrencyCommand(userId, symbol),
                ct);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }

    [HttpGet("favorites/{symbol}/check")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CheckIfFavoritedCurrency(string symbol, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(symbol))
                return BadRequest(new { error = "Symbol cannot be empty." });

            var userId = GetUserIdFromClaims();
            var isFavorited = await _mediator.Send(
                new CheckIfFavoritedQuery(userId, symbol),
                ct);
            return Ok(new { isFavorited });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }

    private string GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return !string.IsNullOrWhiteSpace(userIdClaim?.Value)
            ? userIdClaim.Value
            : throw new UnauthorizedAccessException("User ID not found in claims.");
    }
}
