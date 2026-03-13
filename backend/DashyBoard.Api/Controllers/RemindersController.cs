using DashyBoard.Application.Commands.Reminders;
using DashyBoard.Application.Queries.Reminders;
using DashyBoard.Application.Queries.Reminders.Dto;
using DashyBoard.Application.Queries.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DashyBoard.Api.Controllers
{
    public sealed record CreateReminderRequest(string Title, DateTime DueAtUtc, string? Note = null);
    public sealed record UpdateReminderRequest(string Title, DateTime DueAtUtc, string? Note = null);


    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RemindersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RemindersController(IMediator mediator)
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



        [HttpPost("create")]
        [ProducesResponseType(typeof(ReminderDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateReminder([FromBody] CreateReminderRequest request, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var reminder = await _mediator.Send(
                new CreateReminderCommand(userId.Value, request.Title, request.DueAtUtc, request.Note), ct);

            return Ok(reminder);
        }

        [HttpPut("{reminderId:guid}")]
        [ProducesResponseType(typeof(ReminderDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateReminder(Guid reminderId, [FromBody] UpdateReminderRequest request, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var reminder = await _mediator.Send(
                new UpdateReminderCommand(reminderId, userId.Value, request.Title, request.DueAtUtc, request.Note), ct);

            return Ok(reminder);
        }

        [HttpGet("me")]
        [ProducesResponseType(typeof(IReadOnlyList<ReminderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyReminders(CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            var reminders = await _mediator.Send(new GetMyRemindersQuery(userId.Value), ct);
            return Ok(reminders);
        }

        [HttpPost("{reminderId:guid}/complete")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CompleteReminder(Guid reminderId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new MarkReminderCompletedCommand(reminderId, userId.Value), ct);
            return NoContent();
        }

        [HttpPost("{reminderId:guid}/uncomplete")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UncompleteReminder(Guid reminderId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new MarkReminderUncompletedCommand(reminderId, userId.Value), ct);
            return NoContent();
        }

        [HttpDelete("{reminderId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteReminder(Guid reminderId, CancellationToken ct)
        {
            var userId = await GetCurrentUserIdAsync(ct);
            if (userId is null) return Unauthorized();

            await _mediator.Send(new DeleteReminderCommand(reminderId, userId.Value), ct);
            return NoContent();
        }
    }
}
