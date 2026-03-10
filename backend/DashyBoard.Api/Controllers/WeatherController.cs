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

        [HttpGet("CurrentWeather/{longi}/{lati}")]
        [ProducesResponseType(typeof(CurrentWeatherDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetWeatherSymbol(string longi, string lati, CancellationToken cancellation)
        {
            var weather = await _mediator.Send(new GetCurrentWeatherQuery(longi, lati), cancellation);
            return Ok(weather);
        }

        [HttpGet("WeatherForecast/{longi}/{lati}")]
        [ProducesResponseType(typeof(WeatherForecastDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCurrentWeather(string longi, string lati, CancellationToken cancellation)
        {
            var weather = await _mediator.Send(new GetWeatherForecastQuery(longi, lati), cancellation);
            return Ok(weather);
        
        }
    }
}
