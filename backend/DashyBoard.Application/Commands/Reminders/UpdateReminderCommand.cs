using DashyBoard.Application.Queries.Reminders.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed record UpdateReminderCommand(
       Guid ReminderId,
       Guid UserId,
       string Title,
       DateTime DueAtUtc,
       string? Note = null
   ) : IRequest<ReminderDto>;
}
