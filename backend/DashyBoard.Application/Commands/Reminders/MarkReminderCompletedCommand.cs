using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.Reminders
{
    public sealed record MarkReminderCompletedCommand(
      Guid ReminderId,
      Guid UserId
  ) : IRequest;
}
