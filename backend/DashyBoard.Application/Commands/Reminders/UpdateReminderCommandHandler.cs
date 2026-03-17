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
    public class UpdateReminderCommandHandler : IRequestHandler<UpdateReminderCommand, ReminderDto>
    {
        private readonly IReminderRepository _repository;

        public UpdateReminderCommandHandler(IReminderRepository repository)
        {
            _repository = repository;
        }
        public async Task<ReminderDto> Handle(UpdateReminderCommand command, CancellationToken cancellationToken)
        {
            var reminder = await _repository.UpdateReminderAsync(
                command.ReminderId,
                command.UserId,
                command.Title,
                command.Note,
                command.DueAtUtc,
                cancellationToken
            );

            return reminder;
        }
    }
}
