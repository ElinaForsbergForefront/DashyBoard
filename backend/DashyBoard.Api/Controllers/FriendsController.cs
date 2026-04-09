using DashyBoard.Application.Commands.Poke;
using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Queries.Poke;
using DashyBoard.Application.Queries.Poke.Dto;
using DashyBoard.Application.Queries.User;
using DashyBoard.Application.Queries.UserRelation;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DashyBoard.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FriendsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        private string? GetCurrentSub()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("sub")?.Value;
        }

        private async Task<Guid?> GetCurrentUserIdAsync(CancellationToken ct)
        {
            var sub = GetCurrentSub();
            if (string.IsNullOrWhiteSpace(sub))
                return null;

            var user = await _mediator.Send(new GetUserBySubQuery(sub), ct);
            return user.Id;
        }

        // ========== FRIEND REQUESTS ==========

        [HttpPost("request/{username}")]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
        public async Task<IActionResult> SendFriendRequest(string username, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var relationshipId = await _mediator.Send(new SendFriendRequestCommand(userId.Value, username), ct);
            
            return CreatedAtAction(
                nameof(GetFriend), 
                new { username }, 
                relationshipId);
        }

        [HttpPost("accept/{relationshipId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> AcceptFriendRequest(Guid relationshipId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new AcceptFriendRequestCommand(relationshipId, userId.Value), ct);
            return NoContent();
        }

        [HttpDelete("reject/{relationshipId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> RejectFriendRequest(Guid relationshipId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new RemoveFriendCommand(relationshipId, userId.Value), ct);
            return NoContent();
        }

        [HttpGet("requests")]
        [ProducesResponseType(typeof(IReadOnlyList<UserRelationDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFriendRequests(CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var requests = await _mediator.Send(new GetFriendRequestsQuery(userId.Value), ct);
            return Ok(requests);
        }

        // ========== FRIENDS ==========

        [HttpGet("list")]
        [ProducesResponseType(typeof(IReadOnlyList<UserRelationDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFriendList(CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var friends = await _mediator.Send(new GetFriendListQuery(userId.Value), ct);
            return Ok(friends);
        }

        [HttpGet("{username}")]
        [ProducesResponseType(typeof(UserRelationDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFriend(string username, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var friend = await _mediator.Send(new GetFriendQuery(userId.Value, username), ct);
            if (friend is null) return NotFound();

            return Ok(friend);
        }

        [HttpDelete("{relationshipId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> RemoveFriend(Guid relationshipId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new RemoveFriendCommand(relationshipId, userId.Value), ct);
            return NoContent();
        }

        // ========== BLOCK ==========

        [HttpPost("block/{relationshipId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> BlockUser(Guid relationshipId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new BlockUserCommand(relationshipId, userId.Value), ct);
            return NoContent();
        }

        [HttpPost("unblock/{relationshipId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UnblockUser(Guid relationshipId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new UnBlockUserCommand(relationshipId, userId.Value), ct);
            return NoContent();
        }

        [HttpGet("blocked")]
        [ProducesResponseType(typeof(IReadOnlyList<UserRelationDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBlockedUsers(CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var blocked = await _mediator.Send(new GetBlockedUsersQuery(userId.Value), ct);
            return Ok(blocked);
        }

        // ========== POKES ==========

        [HttpPost("poke/{username}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> SendPoke(string username, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new SendPokeCommand(userId.Value, username), ct);
            return NoContent();
        }

        [HttpGet("pokes")]
        [ProducesResponseType(typeof(IReadOnlyList<PokeDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPokes(CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var pokes = await _mediator.Send(new GetPokesQuery(userId.Value), ct);
            return Ok(pokes);
        }

        [HttpPost("pokes/{pokeId:guid}/seen")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> MarkPokeAsSeen(Guid pokeId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new MarkPokeAsSeenCommand(pokeId, userId.Value), ct);
            return NoContent();
        }

        [HttpDelete("pokes/{pokeId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DismissPoke(Guid pokeId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new InactivatePokeCommand(pokeId, userId.Value), ct);
            return NoContent();
        }
    }
}
