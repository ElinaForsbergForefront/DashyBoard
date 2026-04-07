using DashyBoard.Application.Queries.Gold;
using DashyBoard.Application.Queries.Gold.Dto;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DashyBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoldController : ControllerBase
    {
        private readonly IMediator _mediator;

        //HEJ HEJ VI TESTAR EN GREJ
        public GoldController(IMediator mediator)
        {
            _mediator = mediator;
        }
    
        [HttpGet("tickers")]
        [ProducesResponseType(typeof(IReadOnlyList<AssetTickersDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAssetTickers(CancellationToken cancellation)
        {
            var tickers = await _mediator.Send(new GetAssetTickersQuery(), cancellation);
            return Ok(tickers);
        }

        [HttpGet("price/{symbol}")]
        [ProducesResponseType(typeof(AssetPriceDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAssetPrice(string symbol, CancellationToken cancellation)
        {
            var price = await _mediator.Send(new GetAssetPriceQuery(symbol), cancellation);
            return Ok(price);

        }
    }
}
