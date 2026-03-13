using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Reminders.Dto;
using DashyBoard.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure.Repositories
{
    public sealed class ReminderRepository : IReminderRepository
    {
        private readonly DashyBoardDbContext _db;

        public ReminderRepository(DashyBoardDbContext db)
        {
            _db = db;
        }

        public async Task<ReminderDto> CreateReminderAsync(
            Guid userId,
            string title,
            string? note,
            DateTime dueAtUtc,
            CancellationToken ct)
        {
            var reminder = new Reminder(userId, title, dueAtUtc, note);

            _db.Reminders.Add(reminder);
            await _db.SaveChangesAsync(ct);

            return new ReminderDto(
                Id: reminder.Id,
                UserId: reminder.UserId,
                Title: reminder.Title,
                Note: reminder.Note ?? string.Empty,
                DueAtUtc: reminder.DueAtUtc,
                IsCompleted: reminder.IsCompleted,
                CreatedAtUtc: reminder.CreatedAtUtc,
                CompletedAtUtc: reminder.CompletedAtUtc
            );
        }

        public async Task<ReminderDto> UpdateReminderAsync(
            Guid reminderId,
            Guid userId,
            string title,
            string? note,
            DateTime dueAtUtc,
            CancellationToken ct)
        {
            var reminder = await _db.Reminders.FindAsync(new object[] { reminderId }, ct);

            if (reminder == null || reminder.UserId != userId)
                throw new KeyNotFoundException("Reminder not found.");

            reminder.Update(title, dueAtUtc, note);
            await _db.SaveChangesAsync(ct);

            return new ReminderDto(
                Id: reminder.Id,
                UserId: reminder.UserId,
                Title: reminder.Title,
                Note: reminder.Note ?? string.Empty,
                DueAtUtc: reminder.DueAtUtc,
                IsCompleted: reminder.IsCompleted,
                CreatedAtUtc: reminder.CreatedAtUtc,
                CompletedAtUtc: reminder.CompletedAtUtc
            );
        }

        private async Task AutoCompleteOverdueRemindersAsync(Guid userId, CancellationToken ct)
        {
            var now = DateTime.UtcNow;
            var overdueReminders = await _db.Reminders
                .Where(r => r.UserId == userId && !r.IsCompleted && r.DueAtUtc <= now)
                .ToListAsync(ct);

            if (overdueReminders.Count == 0)
                return;

            foreach (var reminder in overdueReminders)
                reminder.TryAutoComplete(now);

            await _db.SaveChangesAsync(ct);
        }

        public async Task<IReadOnlyList<ReminderDto>> GetMyRemindersAsync(Guid userId, CancellationToken ct)
        {
            await AutoCompleteOverdueRemindersAsync(userId, ct);
            return await _db.Reminders
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .OrderBy(r => r.DueAtUtc)
                .Select(r => new ReminderDto(
                    Id: r.Id,
                    UserId: r.UserId,
                    Title: r.Title,
                    Note: r.Note ?? string.Empty,
                    DueAtUtc: r.DueAtUtc,
                    IsCompleted: r.IsCompleted,
                    CreatedAtUtc: r.CreatedAtUtc,
                    CompletedAtUtc: r.CompletedAtUtc
                ))
                .ToListAsync(ct);

        }

        public async Task MarkCompletedAsync(Guid reminderId, Guid userId, CancellationToken ct)
        {
            var reminder = await _db.Reminders.FindAsync(new object[] { reminderId }, ct);

            if (reminder == null || reminder.UserId != userId)
                throw new KeyNotFoundException("Reminder not found.");

            reminder.MarkCompleted();
            await _db.SaveChangesAsync(ct);
        }

        public async Task MarkUncompletedAsync(Guid reminderId, Guid userId, CancellationToken ct)
        {
            var reminder = await _db.Reminders.FindAsync(new object[] { reminderId }, ct);
            if (reminder == null || reminder.UserId != userId)
                throw new KeyNotFoundException("Reminder not found.");
            reminder.MarkUncompleted();
            await _db.SaveChangesAsync(ct);
        }

        public async Task DeleteReminderAsync(Guid reminderId, Guid userId, CancellationToken ct)
        {
            var reminder = await _db.Reminders.FindAsync(new object[] { reminderId }, ct);
            if (reminder == null || reminder.UserId != userId)
                throw new KeyNotFoundException("Reminder not found.");
            _db.Reminders.Remove(reminder);
            await _db.SaveChangesAsync(ct);
        }
    }
}
