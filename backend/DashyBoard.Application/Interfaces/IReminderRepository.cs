using DashyBoard.Application.Queries.Reminders.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Interfaces
{
    public interface IReminderRepository
    {
        Task<ReminderDto> CreateReminderAsync(Guid userId, string title, string? note, DateTime dueAtUtc, CancellationToken ct);

        Task<ReminderDto> UpdateReminderAsync(Guid reminderId, Guid userId, string title, string? note, DateTime dueAtUtc, CancellationToken ct);

        Task<IReadOnlyList<ReminderDto>> GetMyRemindersAsync(Guid userId, CancellationToken ct);

        Task MarkCompletedAsync(Guid reminderId, Guid userId, CancellationToken ct);

        Task MarkUncompletedAsync(Guid reminderId, Guid userId, CancellationToken ct);

        Task DeleteReminderAsync(Guid reminderId, Guid userId, CancellationToken ct);


    }
}
