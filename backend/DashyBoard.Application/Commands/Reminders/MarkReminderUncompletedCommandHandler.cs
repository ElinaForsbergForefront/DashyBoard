using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using DashyBoard.Application.Interfaces;    


namespace DashyBoard.Application.Commands.Reminders
{
    public class MarkReminderUncompletedCommandHandler : IRequestHandler<MarkReminderUncompletedCommand>
    {
        private readonly IReminderRepository _reminderRepository;

        public MarkReminderUncompletedCommandHandler(IReminderRepository reminderRepository)
        {
            _reminderRepository = reminderRepository;
        }

        public async Task Handle(MarkReminderUncompletedCommand command, CancellationToken ct)
        {
            await _reminderRepository.MarkUncompletedAsync(command.ReminderId, command.UserId, ct);
        }
    }
}
