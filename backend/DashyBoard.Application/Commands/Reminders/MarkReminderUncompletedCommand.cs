using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed record MarkReminderUncompletedCommand(
     Guid ReminderId,
     Guid UserId
 ) : IRequest;
}
