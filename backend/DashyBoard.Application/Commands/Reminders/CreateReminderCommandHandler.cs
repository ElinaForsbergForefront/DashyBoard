using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Reminders.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed class CreateReminderCommandHandler : IRequestHandler<CreateReminderCommand, ReminderDto>
    {
        private readonly IReminderRepository _repository;

        public CreateReminderCommandHandler(IReminderRepository repository)
        {
            _repository = repository;
        }

        public Task<ReminderDto> Handle(CreateReminderCommand command, CancellationToken ct)
        {
            // Minimal “orchestration” – ingen DB-logik här
            return _repository.CreateReminderAsync(
                command.userId,
                command.title,
                command.note,
                command.dueAtUtc,
                ct
            );
        }
    }
}
