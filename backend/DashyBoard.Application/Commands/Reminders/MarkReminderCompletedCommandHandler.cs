using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Reminders.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed class MarkReminderCompletedCommandHandler
        : IRequestHandler<MarkReminderCompletedCommand>
    {
        private readonly IReminderRepository _repository;

        public MarkReminderCompletedCommandHandler(IReminderRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(MarkReminderCompletedCommand command, CancellationToken ct)
        {
            await _repository.MarkCompletedAsync(command.ReminderId, command.UserId, ct);
        }
    }
}
