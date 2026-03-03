using DashyBoard.Application.Commands.Reminders;
using DashyBoard.Application.Queries.Reminders;
using DashyBoard.Application.Queries.Reminders.Dto;
using DashyBoard.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.CodeAnalysis.CSharp.SyntaxTokenParser;

namespace DashyBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RemindersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RemindersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("create")]
        [ProducesResponseType(typeof(ReminderDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateReminder([FromBody] CreateReminderCommand command, CancellationToken ct)
        {
            var reminder = await _mediator.Send(command, ct);
            return Ok(reminder);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateReminder([FromBody] UpdateReminderCommand command, CancellationToken ct)
        {
            var reminder = await _mediator.Send(command, ct);
            return Ok(reminder);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReminder(Guid id, CancellationToken ct)
        {
            var reminders = await _mediator.Send(new GetMyRemindersQuery(id), ct);
            return Ok(reminders);
        }

        [HttpPost("{reminderId}/{userId}/complete")]
        public async Task<IActionResult> CompleteReminder(Guid reminderId, Guid userId, CancellationToken ct)
        {
            await _mediator.Send(new MarkReminderCompletedCommand(reminderId, userId), ct);
            return NoContent();
        }

        [HttpPost("{reminderId}/{userId}/Uncomplete")]
        public async Task<IActionResult> UncompleteReminder(Guid reminderId, Guid userId, CancellationToken ct)
        {
            await _mediator.Send(new MarkReminderUncompletedCommand(reminderId, userId), ct);
            return NoContent();
        }

        [HttpDelete("{reminderId}/{userId}/delete")]
        public async Task<IActionResult> DeleteReminder(Guid reminderId, Guid userId, CancellationToken ct)
        {
            await _mediator.Send(new DeleteReminderCommand(reminderId, userId), ct);
            return NoContent();
        }
    }
}
