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
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetCurrentWeather(string longi, string lati, CancellationToken cancellation)
        {
            var weather = await _mediator.Send(new GetCurrentWeatherQuery(longi, lati), cancellation);
            return Ok(weather);
        }

        [HttpGet("HourlyWeatherForecast/{longi}/{lati}")]
        [ProducesResponseType(typeof(HourlyWeatherForecastDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetHourlyWeatherForecast(string longi, string lati, CancellationToken cancellation)
        {
            var weather = await _mediator.Send(new GetHourlyWeatherForecastQuery(longi, lati), cancellation);
            return Ok(weather);

        }

        [HttpGet("DailyWeatherForecast/{longi}/{lati}")]
        [ProducesResponseType(typeof(DailyWeatherForecastDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetDailyWeatherForecast(string longi, string lati, CancellationToken cancellation)
        {
            var weather = await _mediator.Send(new GetDailyWeatherForecastQuery(longi, lati), cancellation);
            return Ok(weather);

        }


    }
}
