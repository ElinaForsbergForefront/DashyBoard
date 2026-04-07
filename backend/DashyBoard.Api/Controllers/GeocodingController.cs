using DashyBoard.Application.Queries.Geocoding;
using DashyBoard.Application.Queries.Geocoding.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DashyBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class GeocodingController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GeocodingController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{address}")]
        [ProducesResponseType(typeof(GeocodeResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GeocodeAddress(string address, CancellationToken ct)
        {
            var result = await _mediator.Send(new GeocodeAddressQuery(address), ct);
            return Ok(result);
        }
    }
}
