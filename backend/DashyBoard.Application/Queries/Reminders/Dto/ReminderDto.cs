using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.Reminders.Dto
{
    public sealed record ReminderDto(
        Guid Id,
        Guid UserId,
        string Title,
        string? Note,
        DateTime DueAtUtc,
        bool IsCompleted,
        DateTime CreatedAtUtc,
        DateTime? CompletedAtUtc
     );
}
