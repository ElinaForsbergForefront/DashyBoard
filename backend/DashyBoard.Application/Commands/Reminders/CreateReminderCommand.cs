using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using DashyBoard.Application.Queries.Reminders.Dto;


namespace DashyBoard.Application.Commands.Reminders
{
    public sealed record CreateReminderCommand(
        Guid userId,
        string title,
        DateTime dueAtUtc,
        string? note = null
    ) : IRequest<ReminderDto>;
}
