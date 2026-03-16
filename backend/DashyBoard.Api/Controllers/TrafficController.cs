using DashyBoard.Application.Queries.Traffic.GetAllStops;
using DashyBoard.Application.Queries.Traffic.GetStopByName;
using DashyBoard.Application.Queries.Traffic.GetDepartures;
using DashyBoard.Application.Queries.Traffic.GetArrivals;
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
    {
        var stops = await _mediator.Send(new GetAllStopsQuery(), ct);
        return Ok(stops);
    }
       

    [HttpGet("stops/name/{name}")]
    public async Task<IActionResult> GetStopByName(string name, CancellationToken ct)
    {
        var stop = await _mediator.Send(new GetStopByNameQuery(name), ct);
        return Ok(stop);
    }

    [HttpGet("departures/{siteId}")]
    public async Task<IActionResult> GetDepartures(string siteId, CancellationToken ct)
    {
        var departures = await _mediator.Send(new GetDeparturesQuery(siteId), ct);
        return Ok(departures);
    }

    [HttpGet("departures/{siteId}/{dateTime}")]
    public async Task<IActionResult> GetDepartures(string siteId, string dateTime, CancellationToken ct)
    {
        var departures = await _mediator.Send(new GetDeparturesSpecificTimeQuery(siteId, dateTime), ct);
        return Ok(departures);
    }

    [HttpGet("arrivals/{siteId}")]
    public async Task<IActionResult> GetArrivals(string siteId, CancellationToken ct)
    {
        var arrivals = await _mediator.Send(new GetArrivalsQuery(siteId), ct);
        return Ok(arrivals);
    }

    [HttpGet("arrivals/{siteId}/{dateTime}")]
    public async Task<IActionResult> GetArrivals(string siteId, string dateTime, CancellationToken ct)
    {
        var arrivals = await _mediator.Send(new GetArrivalsSpecificTimeQuery(siteId, dateTime), ct);
        return Ok(arrivals);
    }
}