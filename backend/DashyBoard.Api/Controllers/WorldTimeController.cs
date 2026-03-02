using DashyBoard.Application.Queries.WorldTime;
using DashyBoard.Application.Queries.WorldTime.Dto;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace DashyBoard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorldTimeController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorldTimeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("time")]
    [ProducesResponseType(typeof(WorldTimeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetTimeByTimezone(
        [FromQuery] [Required] string timezone, 
        CancellationToken cancellation)
    {
        var time = await _mediator.Send(new GetTimeByTimezoneQuery(timezone), cancellation);
        return Ok(time);
    }

    [HttpGet("timezones")]
    [ProducesResponseType(typeof(IReadOnlyList<TimezoneDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllTimezones(CancellationToken cancellation)
    {
        var timezones = await _mediator.Send(new GetAllTimezonesQuery(), cancellation);
        return Ok(timezones);
    }
}