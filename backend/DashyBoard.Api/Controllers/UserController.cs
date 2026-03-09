using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DashyBoard.Application.Commands.User;
using DashyBoard.Application.Queries.User; 
using DashyBoard.Application.Queries.User.Dto;

namespace DashyBoard.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        private string? GetCurrentSub()
        {
            return User.Identity?.Name;
        }

        [HttpGet("profile/{userId}")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserProfile(Guid userId)
        {
            var query = new GetUserByIdQuery(userId);
            var userProfile = await _mediator.Send(query);
            return Ok(userProfile);
        }


        [HttpGet("me")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var sub = GetCurrentSub();

            if (string.IsNullOrWhiteSpace(sub))
                return Unauthorized();

            var query = new GetUserBySubQuery(sub);
            var userProfile = await _mediator.Send(query);

            return Ok(userProfile);
        }

        [HttpDelete("me")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteCurrentUser(CancellationToken ct)
        {
            var sub = GetCurrentSub();

            if (string.IsNullOrWhiteSpace(sub))
                return Unauthorized();

            await _mediator.Send(new DeleteUserBySubCommand(sub), ct);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteUserById(Guid id, CancellationToken ct)
        {
            await _mediator.Send(new DeleteUserByIdCommand(id), ct);
            return NoContent();
        }

        [HttpPut("me")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateUserBySubCommand command, CancellationToken ct)
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(sub))
                return Unauthorized();

            var result = await _mediator.Send(command with { sub = sub }, ct);
            return Ok(result);
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateUserById(Guid id, [FromBody] UpdateUserByIdCommand command, CancellationToken ct)
        {
            var result = await _mediator.Send(command with { Id = id }, ct);
            return Ok(result);
        }
    }
}
