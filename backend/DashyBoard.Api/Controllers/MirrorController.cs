using DashyBoard.Application.Commands.Mirror;
using DashyBoard.Application.Commands.Widget;
using DashyBoard.Application.Queries.Mirror;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DashyBoard.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MirrorController : ControllerBase
{
    private readonly IMediator _mediator;

    public MirrorController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private string? GetCurrentSub()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MirrorDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyMirrors(CancellationToken ct)
    {
        var sub = GetCurrentSub();
        if (string.IsNullOrWhiteSpace(sub))
            return Unauthorized();

        var result = await _mediator.Send(new GetMirrorsByUserSubQuery(sub), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(MirrorDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMirrorById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetMirrorByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(MirrorDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateMirror([FromBody] CreateMirrorRequest request, CancellationToken ct)
    {
        var sub = GetCurrentSub();
        if (string.IsNullOrWhiteSpace(sub))
            return Unauthorized();

        var result = await _mediator.Send(new CreateMirrorCommand(sub, request.Name, request.WidthCm, request.HeightCm), ct);
        return CreatedAtAction(nameof(GetMirrorById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(MirrorDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateMirror(Guid id, [FromBody] UpdateMirrorCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { Id = id }, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteMirror(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteMirrorCommand(id), ct);
        return NoContent();
    }

    [HttpPost("{mirrorId:guid}/widget")]
    [ProducesResponseType(typeof(MirrorDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> AddWidget(Guid mirrorId, [FromBody] AddWidgetRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new AddWidgetCommand(mirrorId, request.Type, request.X, request.Y), ct);
        return Ok(result);
    }

    [HttpPut("{mirrorId:guid}/widget/{widgetId:guid}")]
    [ProducesResponseType(typeof(MirrorDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> MoveWidget(Guid mirrorId, Guid widgetId, [FromBody] MoveWidgetRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new MoveWidgetCommand(mirrorId, widgetId, request.X, request.Y), ct);
        return Ok(result);
    }

    [HttpDelete("{mirrorId:guid}/widget/{widgetId:guid}")]
    [ProducesResponseType(typeof(MirrorDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> RemoveWidget(Guid mirrorId, Guid widgetId, CancellationToken ct)
    {
        var result = await _mediator.Send(new RemoveWidgetCommand(mirrorId, widgetId), ct);
        return Ok(result);
    }
}

public record CreateMirrorRequest(string Name, double WidthCm, double HeightCm);
public record AddWidgetRequest(string Type, double X, double Y);
public record MoveWidgetRequest(double X, double Y);
