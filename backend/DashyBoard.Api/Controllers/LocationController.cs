using MediatR;
using Microsoft.AspNetCore.Mvc;
using DashyBoard.Application.Queries.Location;

namespace DashyBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {

        private readonly IMediator _mediator;

        public LocationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetAllCountrys(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetAllCountriesQuery(), cancellationToken);
            return Ok(result);
        }

        [HttpGet("Country/{countryName}")]
        public async Task<IActionResult> GetCountryByName(string countryName, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetCountryByNameQuery(countryName), cancellationToken);
            return Ok(result);
        }

        [HttpGet("city")]
        public async Task<IActionResult> GetCitiesByName([FromQuery] string cityName, [FromQuery] string countryCode, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetCityByNameQuery(cityName, countryCode), cancellationToken);
            return Ok(result);
        }
    }
}
