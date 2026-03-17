using DashyBoard.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed class DeleteReminderCommandHandler : IRequestHandler<DeleteReminderCommand>
    {
        private readonly IReminderRepository _repository;

        public DeleteReminderCommandHandler(IReminderRepository repository)
        {
            _repository = repository;
        }

        public Task Handle(DeleteReminderCommand command, CancellationToken ct)
        {
            return _repository.DeleteReminderAsync(
                command.ReminderId,
                command.UserId,
                ct
            );
        }
    }
}
