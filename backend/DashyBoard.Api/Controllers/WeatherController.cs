using DashyBoard.Application.Queries.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DashyBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly IMediator _mediator;
        public WeatherController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //[HttpGet("CurrentWeather")]
        //[ProducesResponseType(typeof(CurrentWeatherDto), StatusCodes.Status200OK)]
        //public async Task<IActionResult> GetCurrentWeather(CancellationToken cancellation)
        //{
        //    var weather = await _mediator.Send(new GetCurrentWeatherQuery(), cancellation);
        //    return Ok(weather);
        //
        //}
        [HttpGet("CurrentWeather/{longi}/{lati}")]
        [ProducesResponseType(typeof(WeatherSymbolDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetWeatherSymbol(string longi, string lati, CancellationToken cancellation)
        {
            var weatherSymbol = await _mediator.Send(new GetWeatherSymbolQuery(longi, lati), cancellation);
            return Ok(weatherSymbol);
        }
    }
}
// Comments for deveolping.
// https://opendata.smhi.se/metfcst/snow1gv1/parameters
// We want Weather symbol (symbol_code)
// We want air temperature (air_temperature)

// We mabye want Percipitation Type (predominant_precipitation_type_at_surface)
// We mabye want wind speed (wind_speed)
// We mabye want wind direction (wind_from_direction)
