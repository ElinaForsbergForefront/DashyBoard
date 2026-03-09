using DashyBoard.Application.Queries.Traffic.GetAllStops;
using DashyBoard.Application.Queries.Traffic.GetStopByName;
using DashyBoard.Application.Queries.Traffic.GetDepartures;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DashyBoard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrafficController : ControllerBase
{
    private readonly IMediator _mediator;

    public TrafficController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stops/list")]
    public async Task<IActionResult> GetAllStops(CancellationToken ct)
        => Ok(await _mediator.Send(new GetAllStopsQuery(), ct));

    [HttpGet("stops/name/{name}")]
    public async Task<IActionResult> GetStopByName(string name, CancellationToken ct)
        => Ok(await _mediator.Send(new GetStopByNameQuery(name), ct));

    [HttpGet("departures/{siteId}")]
    public async Task<IActionResult> GetDepartures(string siteId, CancellationToken ct)
        => Ok(await _mediator.Send(new GetDeparturesQuery(siteId), ct));
}