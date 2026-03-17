using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed record DeleteReminderCommand(
        Guid ReminderId,
        Guid UserId
    ) : MediatR.IRequest;
}
